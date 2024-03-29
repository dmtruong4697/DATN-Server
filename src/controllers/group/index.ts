import { Request, Response } from "express";
import UserModel from "../../models/user";

const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);
        if (!user) res.status(404).json({ message: "User not found" });
        
        
    } catch (error) {
        res.status(500).json({ message: "controller group " + error});
    }
}