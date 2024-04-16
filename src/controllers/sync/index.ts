import { Request, Response } from "express";
import { firestore } from "firebase-admin";
import { mkdir } from "fs";
import multer from "multer";
import { app } from "../../config/firebase.config";
import {getStorage} from "firebase-admin/storage";
import UserModel from "../../models/user";
import UserDataModel from "../../models/userData";

const store = getStorage(app);
const bucket = store.bucket();

const storageOptions = {
    destination: function (req: Request, file, cb) {
        mkdir(`userData/${req.body.userId}`, { recursive: true }, (err) => {
            if (err) throw err;
          }); 
        cb(null, `userData/${req.body.userId}/${file.originalname}`);
    }
};

const uploadData = multer({ storage: multer.memoryStorage() });

const storeData = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files) {
            res.status(400).json({ message: "No files to upload." });
            return;
        }

        const userId = req.body.userId;
        const files = req.files as Express.Multer.File[];

        const uploadPromises = files.map(file => {
            const filePath = `userData/${userId}/${file.originalname}`;
            const fileUpload = bucket.file(filePath);

            return fileUpload.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype,
                }
            });
        });

        await Promise.all(uploadPromises);

        res.status(200).json({ message: "Files uploaded successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error uploading files: " + error });
    }
}

const uploadUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.body.userId);
        if (!user) res.status(404).json({ message: "User not found" });

        await UserDataModel.findByIdAndDelete(user.dataId);
        user.dataId = {};
        await user.save();

        const userData = new UserDataModel({
            userId: user._id,
            loans: req.body.loans,
            transactions: req.body.transactions,
            transactionTypes: req.body.transactionTypes,
            wallets: req.body.wallets,
        });
        await userData.save();

        user.dataId = userData._id;
        await user.save();

        res.status(200).json({ message: "Upload user data success"});
    } catch (error) {
        res.status(500).json({ message: "Error uploading files: " + error });
    }
}

export {uploadData, storeData, uploadUserData}