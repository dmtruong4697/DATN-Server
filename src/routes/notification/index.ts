import express from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { sendNotification } from "../../controllers/notification";

const notificationRouter = express.Router();

notificationRouter.post("/send-notification", verifyToken, sendNotification);

export default notificationRouter;