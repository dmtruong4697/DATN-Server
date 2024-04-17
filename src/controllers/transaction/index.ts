import { Request, Response } from "express";
import UserModel from "../../models/user";
import GroupModel from "../../models/group";
import TransactionModel from "../../models/transaction";

const createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) res.status(404).json({ message: "User not found" });

        const group = await GroupModel.findById(req.body.groupId);
        if( !group) res.status(404).json({ message: "Group not found" });

        const newTransaction = new TransactionModel({
            userId: user._id,
            groupId: group._id,
            name: req.body.name,
            total: req.body.total,
            currencyUnit: group.currencyUnit,
            createAt: req.body.createAt,
            note: req.body.note,
            imageUrls: [],
        });

        group.transactionIds.push(newTransaction._id);
        user.transactionIds.push(newTransaction._id);
        await user.save();
        await group.save();

        await newTransaction.save();
        res.status(201).json({ message: "Create Transaction Success"});
        
        
    } catch (error) {
        res.status(500).json({ message: "controller transaction " + error});
    }
}

const getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const transaction = await TransactionModel.findById(req.body.transactionId);
        if (!transaction) res.status(404).json({ message: "Transaction not found" });        
        res.status(200).json({transaction});
    } catch (error) {
        res.status(500).json({ message: "controller transaction " + error});
    }
}

const getTransactionByGroupId = async (req: Request, res: Response): Promise<void> => {
    try {

        const user = await UserModel.findById(req.body.userId);
        if (!user) res.status(404).json({ message: "User not found" });
        
        const group = await GroupModel.findById(req.body.groupId);
        if (!group) res.status(404).json({ message: "Group not found" });

        if(!group.memberIds.includes(user._id)) res.status(404).json({ message: "User not in group" });
        
        const transactions = await TransactionModel.find({
            groupId: req.body.groupId,
        });
        if (!transactions) res.status(404).json({ message: "Transaction not found" });        
        res.status(200).json({transactions});
    } catch (error) {
        res.status(500).json({ message: "controller transaction " + error});
    }
}

export {createTransaction, getTransactionById, getTransactionByGroupId}