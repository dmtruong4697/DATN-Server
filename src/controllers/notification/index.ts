
import UserModel from "../../models/user";
import { getMessaging } from "firebase-admin/messaging";
import { Request, Response } from "express";
import { app } from "../../config/firebase.config";

// const registrationToken = ['cMlkDr-GS8aU5xrTZks4NZ:APA91bELlZqg79jQB9ZsVYRCl324QeY1qIcXoCN52f-2JTVxaJKfxNlEQxJhndNafQZUYW3KMxxbCM_bobt95hxll2heNjVLNZCJaUmBZl-lQqKKXh-lvrkGeWtSRG1XKUKlR4WS36H2'];

const getAllDeviceToken = async (): Promise<string[]> => {
    try {
        const users = await UserModel.find();
        const deviceToken: string[] = [];

        users.forEach((user) => {
            deviceToken.push(user.deviceToken);
        })

        return deviceToken;
    } catch (error) {
        console.log(error);
    }
}

// const message = {
//     notification: {
//         title: 'Test Notification',
//         body: 'This is a Test Notification',
//         imageUrl: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wtct?ver=23bb',
//     },
//     tokens: getAllDeviceToken(),
// };

const sendNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const tokens = await getAllDeviceToken();
        await getMessaging(app).sendMulticast({
            notification: {
                title: req.body.title,
                body: req.body.body,
                imageUrl: req.body.imageUrl,
            },
            tokens: tokens,
            data: {
                type: 'new version'
            }
        })
            .then((resp) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', resp);
                res.status(200).json({ message: "send noti success" })
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

        
    } catch (error) {
        res.status(500).json({ message: "controller noti " + error});
    }
}

export { sendNotification }