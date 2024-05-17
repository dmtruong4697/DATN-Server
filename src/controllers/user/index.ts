import { Request, Response } from "express";
import UserModel from "../../models/user";
import { getStorage } from "firebase-admin/storage";
import { app } from "../../config/firebase.config";
import multer from "multer";
import { unlinkSync } from "fs";

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

        const {userName, phoneNumber} = req.body;
        if (userName)  user!.userName = userName;
        if (phoneNumber) user!.phoneNumber = phoneNumber;
        // if (req.file) user!.avatarImage = url.toString();

        await user?.save();
        
        return res.status(200).json({ message: "Update successful"});
    } catch (error) {
        return res.status(500).json({ message: "controller user " + error});
    }
}

// upload file

export const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
});

const upload = multer({
    storage: avatarStorage,
})


const updateAvatarImage = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const {path: filePath, originalname} = req.file;

        const uploadResponse = await bucket.upload(filePath, {
            destination: `avatarImage/${user._id.toString()}/${originalname}`,
            metadata: {
                contentType: req.file.mimetype
            }
        })

        unlinkSync(filePath);

        const imageUrl = uploadResponse[0].getSignedUrl({
            action: "read",
            expires: '03-09-2491',
        })

        user!.avatarImage = (await imageUrl).toString();
        await user?.save()

        return res.status(200).send({
            message: 'Uploaded successfully',
            url: (await imageUrl).toString()
        })
        
    } catch (error) {
        return res.status(500).json({ message: "controller upload image " + error});
    }
}

const changePassword = async (req: Request, res: Response): Promise<any> => {
    try {
        
        const user = await UserModel.findById(req.body.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const {password} = req.body;
        if (password) user!.password = password;
        // if (req.file) user!.avatarImage = url.toString();

        await user?.save();
        
        return res.status(200).json({ message: "Update password successful"});
    } catch (error) {
        return res.status(500).json({ message: "controller user " + error});
    }
}

export { getUserById, getProfile, updateProfile, updateAvatarImage, changePassword }