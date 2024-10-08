import { Request, Response } from "express";
import UserModel from "../../models/user";
import GroupModel from "../../models/group";
import TransactionModel from "../../models/transaction";

const createTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const group = await GroupModel.findById(req.body.groupId);
        if( !group) return res.status(404).json({ message: "Group not found" });

        const newTransaction = new TransactionModel({
            userId: user._id,
            groupId: group._id,
            name: req.body.name,
            total: req.body.total,
            currencyUnit: group.currencyUnit,
            createAt: req.body.createAt,
            createTime: req.body.createTime,
            note: req.body.note,
            imageUrls: [],
        });

        group.transactionIds.push(newTransaction._id);
        user.transactionIds.push(newTransaction._id);
        await user.save();
        await group.save();

        await newTransaction.save();
        return res.status(201).json({ message: "Create Transaction Success"});
        
        
    } catch (error) {
        return res.status(500).json({ message: "controller transaction " + error});
    }
}

const getTransactionById = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const transaction = await TransactionModel.findById(req.body.transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });        
        return res.status(200).json({transaction});
    } catch (error) {
        return res.status(500).json({ message: "controller transaction " + error});
    }
}

const getTransactionByGroupId = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (!group.memberIds.includes(user._id)) return res.status(404).json({ message: "User not in group" });
        
        const transactions = [];
        for (const itemId of group.transactionIds) {
            const transaction = await TransactionModel.findById(itemId);
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }
            transactions.push(transaction);
        }
        
        return res.status(200).json({ transactions });
    } catch (error) {
        return res.status(500).json({ message: "controller transaction " + error });
    }
}

const deleteTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const group = await GroupModel.findById(req.body.groupId);
        if( !group) return res.status(404).json({ message: "Group not found" });

        const transaction = await TransactionModel.findById(req.body.transactionId);
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });

        group.transactionIds = group.transactionIds.filter(id => id.toString() !== transaction._id.toString());

        user.transactionIds = user.transactionIds.filter(id => id.toString() !== transaction._id.toString());

        await user.save();
        await group.save();

        await transaction.deleteOne();

        return res.status(200).json({ message: "Delete Transaction Success" });
        
        
    } catch (error) {
        return res.status(500).json({ message: "controller transaction " + error});
    }
}


export {createTransaction, getTransactionById, getTransactionByGroupId, deleteTransaction}