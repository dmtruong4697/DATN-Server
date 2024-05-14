import { Request, Response } from "express";
import UserModel from "../../models/user";
import { getStorage } from "firebase-admin/storage";
import { app } from "../../config/firebase.config";

const store = getStorage(app);
const bucket = store.bucket();

const getUserById = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId, 
            {
                password: 0, 
                dataUrl: 0,
                phoneNumber: 0,
                groupIds: 0,
                deviceToken: 0,
                notifications: 0,
                createAt: 0,
                transactionIds: 0,
            }
        );

        if (!user) {return res.status(404).json({ message: "User not found" })} else return res.json({user});
    } catch (error) {
        return res.status(500).json({ message: "controller user " + error});
    }
}

const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        
        return res.json({user});
    } catch (error) {
        return res.status(500).json({ message: "controller user " + error});
    }
}

const updateProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Upload avatar image
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const filePath = `avatarImage/${user._id.toString()}/${file.originalname}`;
        const fileUpload = bucket.file(filePath);

        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            }
        });

        // Get download URL
        const url = await fileUpload.getSignedUrl({
            action: "read",
            expires: '03-09-2491',
        });

        const {userName, password, phoneNumber} = req.body;
        if (userName)  user!.userName = userName;
        if (password) user!.password = password;
        if (phoneNumber) user!.phoneNumber = phoneNumber;
        if (req.file) user!.avatarImage = url.toString();

        await user?.save();
        
        return res.status(200).json({ message: "Update successful"});
    } catch (error) {
        return res.status(500).json({ message: "controller user " + error});
    }
}

export { getUserById, getProfile, updateProfile }