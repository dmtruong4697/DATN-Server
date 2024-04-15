import { Request, Response } from "express";
import { firestore } from "firebase-admin";
import { mkdir } from "fs";
import multer from "multer";
import { app } from "../../config/firebase.config";
import {getStorage} from "firebase-admin/storage";

// var storage = multer.diskStorage({
//     destination: function (req: Request, file, cb) {
//         mkdir(`syncData/${req.body.userId}`, { recursive: true }, (err) => {
//             if (err) throw err;
//           }); 
//         // Uploads is the Upload_folder_name
//         cb(null, `syncData/${req.body.userId}`);
//     },
//     filename: function (req: Request, file, cb) {
//         cb(null, file.fieldname + "-" + Date.now() + ".json");
//     },
// });

// const uploadUserData = multer({
//     storage: storage,
// })

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

const uploadUserData = multer({ storage: multer.memoryStorage() });

const storeUserData = async (req: Request, res: Response): Promise<void> => {
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

export {uploadUserData, storeUserData}