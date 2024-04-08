import mongoose, { Schema, model } from "mongoose";

const NotificationSchema = new Schema(
    {
        title: {
            type: String,
        },
        body: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        createAt: {
            type: String,
        },
    },
    {
        collection: 'Notification'
    }
)

const NotificationModel = mongoose.model("Notification", NotificationSchema);
export default NotificationModel;