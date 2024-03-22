import { Request, Response } from "express";
import UserModel from "../../models/user";

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const user = await UserModel.findById(req.body.userId, 
            {
                password: 0, 
                dataUrl: 0,
                phoneNumber: 0,
            }
        );

        if (!user) res.status(404).json({ message: "User not found" });
        
        res.json({user});
    } catch (error) {
        res.status(500).json({ message: "controller user " + error});
    }
}

const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) res.status(404).json({ message: "User not found" });
        
        res.json({user});
    } catch (error) {
        res.status(500).json({ message: "controller user " + error});
    }
}

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) res.status(404).json({ message: "User not found" });

        const {userName, password, phoneNumber} = req.body;
        if (userName)  user!.userName = userName;
        if (password) user!.password = password;
        if (phoneNumber) user!.phoneNumber = phoneNumber;

        await user?.save();
        
        res.json({ message: "Update successful"});
    } catch (error) {
        res.status(500).json({ message: "controller user " + error});
    }
}

export { getUserById, getProfile, updateProfile }