import { Request, Response } from "express";
import UserModel from "../../models/user";
import GroupModel from "../../models/group";

function generateCode(): string {
    let result = '';
    const characters = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) res.status(404).json({ message: "User not found" });

        const inviteCode = generateCode();

        const newGroup = new GroupModel({
            name: req.body.name,
            inviteCode: inviteCode,
            groupOwnerId: req.body.userId,
            memberIds: [user._id],
            transactionIds: [],
            createAt: req.body.createAt,
        });

        user.groupIds.push(newGroup._id);
        await user.save();

        await newGroup.save();
        res.status(201).json({ message: "Create Group Success", inviteCode: inviteCode});
        
        
    } catch (error) {
        res.status(500).json({ message: "controller group " + error});
    }
}

const getGroupById = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) res.status(404).json({ message: "Group not found" });        
        res.json({group});

    } catch (error) {
        res.status(500).json({ message: "controller group " + error});
    }
}

const joinGroupByInvitecode = async (req: Request, res: Response): Promise<void> => {
    try {

        const user = await UserModel.findById(req.body.userId);
        if (!user) res.status(404).json({ message: "User not found" });
        
        const group = await GroupModel.findOne({
            inviteCode: req.body.inviteCode,
        });
        if (!group) res.status(404).json({ message: "Group not found" });        

        group.memberIds.push(user._id);
        await group.save();

        user.groupIds.push(group._id);
        await user.save();

        res.status(200).json({ message: "Join Group successful"});

    } catch (error) {
        res.status(500).json({ message: "controller group " + error});
    }
}

export {createGroup, getGroupById, joinGroupByInvitecode}