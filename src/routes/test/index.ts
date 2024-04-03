import express, { Request, Response } from "express";
import { getMessaging } from "firebase-admin/messaging";
import { app } from "../../config/firebase.config";

const testRouter = express.Router();

const registrationToken = 'c1wd4T8-QzuS920hOET6a8:APA91bFri_0BrXp5jy7Buc4HiNyodixiU8xf097umxYxO-tln4WCVAoJUGZVjHFRio7FQIkKcmpAHGNvbUVGqbV7btKHFNf8_7743-x9pU9tT4FieHqXtauXMF0_UmSL-b4-gj5EYMfY';


const message = {
    notification: {
        title: 'testtt',
        body: 'teastststt',
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

export default testRouter;
 