import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const GroupSchema = new Schema(
    {
        name: {
            type: String,
        },
        inviteCode: {
            type: String,
        },
        groupOwnerId: {
            type: String,
        },
        memberIds: [
            {
                type: Object,
            }
        ],
        transactionIds: [
            {
                type: Object,
            }
        ],
        createAt: {
            type: String,
        },
        currencyUnit: {
            type: String,
        },
    },
    {
        collection: 'Group'
    }
)

const GroupModel = mongoose.model("Group", GroupSchema);
export default GroupModel;