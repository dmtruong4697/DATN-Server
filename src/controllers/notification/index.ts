
import UserModel from "../../models/user";
import { getMessaging } from "firebase-admin/messaging";
import { Request, Response } from "express";
import { app } from "../../config/firebase.config";

const getTodayInactiveDeviceToken = async() : Promise<string[]> => {
    try {
        const deviceToken = [];
        const users = await UserModel.find({
            latestActive: new Date().toISOString().slice(0, 10),
        });

        users.map(user => {
            deviceToken.push(user.deviceToken);
        })

        return deviceToken;

    } catch (error) {
        
    }
}

const message = {
    notification: {
        title: 'Test Notification',
        body: 'This is a Test Notification',
    },
    tokens: getTodayInactiveDeviceToken(),
};

const sendActiveRemindNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        await getMessaging(app).sendMulticast(message)
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