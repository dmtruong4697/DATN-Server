import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";
import NotificationModel from "../notification";

const UserSchema = new Schema(
    {
        userName: {
            type: String,
            // required: true,
        },
        password: {
            type: String,
            // required: true,
        },
        email: {
            type: String,
            // required: true,
        },
        phoneNumber: {
            type: String,
            // required: true,
        },
        avatarImage: {
            type: String,
        },
        status: {
            type: String,
        },
        validateCode: {
            type: String,
        },
        groupIds: [
            {
                type: Object,
            }
        ],
        transactionIds: [
            {
                type: Object,
            }
        ],
        dataUrl: {
            type: String,
        },
        createAt: {
            type: String,
        },
        lastSync: {
            type: String,
        },
        deviceToken: [
            {
                type: String,
            }
        ],
        latestActive: {
            type: String,
        },
        notifications: [
            {
                notificationId: { type: Object},
                isRead: { type: Boolean },
            }
        ],
    },
    {
        collection: 'User'
    }
)

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;