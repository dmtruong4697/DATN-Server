import express, { Request, Response } from "express";
import { getMessaging } from "firebase-admin/messaging";
import { app } from "../../config/firebase.config";
import multer from "multer";
import { unlink, unlinkSync } from "fs";

const testRouter = express.Router();

const registrationToken = 'c1wd4T8-QzuS920hOET6a8:APA91bFri_0BrXp5jy7Buc4HiNyodixiU8xf097umxYxO-tln4WCVAoJUGZVjHFRio7FQIkKcmpAHGNvbUVGqbV7btKHFNf8_7743-x9pU9tT4FieHqXtauXMF0_UmSL-b4-gj5EYMfY';


const message = {
    notification: {
        title: 'Test Notification',
        body: 'This is a Test Notification',
        imageUrl: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wtct?ver=23bb',
    },
    token: registrationToken
};

const sendNoti = async (req: Request, res: Response): Promise<void> => {
    try {
        await getMessaging(app).send(message)
            .then((resp) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', resp);
                res.status(200).json({ message: "send noti success" })
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

        
    } catch (error) {
        res.status(500).json({ message: "controller group " + error});
    }
}

testRouter.post("/send-noti", sendNoti);



// upload file

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".png");
    },
});

const upload = multer({
    storage: storage,
})


testRouter.post('/upload-file', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    if(req.file) res.status(200).json({message: "uploaded"});
  })

const deleteFile = () => {
    unlink('uploads/file-1713148468537.png', (err) => {
        if (err) throw err;
        console.log('path/file.txt was deleted');
    })
}

testRouter.post('/delete-file', deleteFile);
export default testRouter;
 