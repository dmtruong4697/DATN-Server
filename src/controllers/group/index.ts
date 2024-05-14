import { Request, Response } from "express";
import UserModel from "../../models/user";
import GroupModel from "../../models/group";
import TransactionModel from "../../models/transaction";

function generateCode(): string {
    let result = '';
    const characters = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createGroup = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const inviteCode = generateCode();

        const newGroup = new GroupModel({
            name: req.body.name,
            inviteCode: inviteCode,
            currencyUnit: req.body.currencyUnit,
            groupOwnerId: req.body.userId,
            memberIds: [user._id],
            transactionIds: [],
            createAt: req.body.createAt,
        });

        user.groupIds.push(newGroup._id);
        await user.save();

        await newGroup.save();
        return res.status(201).json({ message: "Create Group Success", group: newGroup});
        
        
    } catch (error) {
        return res.status(500).json({ message: "controller group " + error});
    }
}

const getGroupById = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });        
        return res.json({group});

    } catch (error) {
        return res.status(500).json({ message: "controller group " + error});
    }
}

const joinGroupByInvitecode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, inviteCode } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const group = await GroupModel.findOne({ inviteCode: inviteCode });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }        

        if (group.memberIds.includes(user._id)) {
            return res.status(400).json({ message: "User already in the group" });
        }

        group.memberIds.push(user._id);
        await group.save();

        user.groupIds.push(group._id);
        await user.save();

        return res.status(200).json({ message: "Join Group successful", group });

    } catch (error) {
        return res.status(500).json({ message: "Error in joining group: " + error });
    }
}

const leaveGroupById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, groupId } = req.body;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const indexOfUser = group.memberIds.indexOf(user._id);
        if (indexOfUser === -1) {
            return res.status(400).json({ message: "User not in the group" });
        }

        group.memberIds.splice(indexOfUser, 1);
        await group.save();

        const indexOfGroup = user.groupIds.indexOf(group._id);
        if (indexOfGroup !== -1) {
            user.groupIds.splice(indexOfGroup, 1);
            await user.save();
        }

        return res.status(200).json({ message: "Leave Group successful", group });

    } catch (error) {
        return res.status(500).json({ message: "Error in leaving group: " + error });
    }
}

const getGroupList = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });   
        const result = [];
        user.groupIds.map((item) => {
            result.push({
                _id: item,
            })
        })     
        return res.json({groupIds: result});

    } catch (error) {
        return res.status(500).json({ message: "controller group " + error});
    }
}

const getGroupMember = async (req: Request, res: Response): Promise<any> => {
    try {

        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if(!group.memberIds.includes(user._id)) return res.status(404).json({ message: "User not in group" });
        
        const users = [];
        group.memberIds.forEach(async(user) => {
            const member = await UserModel.findById(user, 
                {
                    password: 0, 
                    dataUrl: 0,
                    phoneNumber: 0,
                    groupIds: 0,
                    deviceToken: 0,
                    notifications: 0,
                    createAt: 0,
                }
            );
            users.push(member);
        })
        return res.status(200).json({users});
    } catch (error) {
        return res.status(500).json({ message: "controller group " + error});
    }
}

const getGroupTotal = async (req: Request, res: Response): Promise<any> => {
    try {

        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if(!group.memberIds.includes(user._id)) return res.status(404).json({ message: "User not in group" });

        const transactions = [];
        let total = 0;
        for (const itemId of group.transactionIds) {
            const transaction = await TransactionModel.findById(itemId);
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }
            transactions.push(transaction);
            total = total + transaction.total;
        }

        return res.status(200).json({total});
       
    } catch (error) {
        return res.status(500).json({ message: "controller group " + error});
    }
}

async function calculateTotalAmount(transactionIds: string[]): Promise<number> {
    let total = 0;
    for (const itemId of transactionIds) {
        const transaction = await TransactionModel.findById(itemId);
        if (transaction) {
            total += transaction.total;
        }
    }
    return total;
}

interface MemberInfo {
    memberId: string;
    amountOwed: number;
    name: string;
    image: string;
}

const splitMoney = async (req: Request, res: Response): Promise<any> => {
    try {
        const { groupId } = req.body;

        const group = await GroupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const totalMembers = group.memberIds.length;
        if (totalMembers === 0) {
            return res.status(400).json({ message: "Group has no members" });
        }

        const totalAmount = await calculateTotalAmount(group.transactionIds);
        if (totalAmount === 0) {
            return res.status(400).json({ message: "No transactions in the group" });
        }

        const amountPerMember = totalAmount / totalMembers;

        // Get user details for each member
        const membersDetailsPromises = group.memberIds.map(async memberId => {
            const user = await UserModel.findById(memberId);
            return { 
                id: user.id,
                name: user.userName,
                image: user.avatarImage,
                amountOwed: amountPerMember
            };
        });

        // Wait for all user details queries to resolve
        const membersDetails = await Promise.all(membersDetailsPromises);

        // Calculate actual amount spent by each member
        const memberAmountSpent: { [key: string]: number } = {};
        for (const transactionId of group.transactionIds) {
            const transaction = await TransactionModel.findById(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }
            const spenderId = transaction.userId;
            if (!memberAmountSpent[spenderId]) {
                memberAmountSpent[spenderId] = 0;
            }
            memberAmountSpent[spenderId] += transaction.total;
        }

        // Adjust the amount each member owes based on actual spending
        for (const memberId in memberAmountSpent) {
            const actualSpent = memberAmountSpent[memberId];
            const memberDetail = membersDetails.find(member => member.id == memberId);
            if (memberDetail) {
                memberDetail.amountOwed -= actualSpent;
            }
        }

        return res.status(200).json({ membersDetails });

    } catch (error) {
        return res.status(500).json({ message: "Error in splitting money: " + error });
    }
}


export {
    createGroup, 
    getGroupById, 
    joinGroupByInvitecode, 
    getGroupList, 
    getGroupMember, 
    leaveGroupById,
    getGroupTotal,
    splitMoney,
}