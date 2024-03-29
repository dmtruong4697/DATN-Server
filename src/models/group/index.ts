import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const GroupSchema = new Schema(
    {
        name: {
            type: String,
            // required: true,
        },
        inviteCode: {
            type: String,
        },
        groupOwnerId: {
            type: String,
        },
        memberIds: [
            {
                type: String,
            }
        ],
        transactionIds: [
            {
                type: String,
            }
        ],
        createAt: {
            type: String,
        },
    },
    {
        collection: 'Group'
    }
)

const GroupModel = mongoose.model("User", GroupSchema);
export default GroupModel;