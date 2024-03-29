import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const TransactionSchema = new Schema(
    {
        groupId: {
            type: String,
        },
        name: {
            type: String,
        },
        total: {
            type: Number,
        },
        createAt: {
            type: String,
        },
        note: {
            type: String,
        },
        imageUrls: [
            {
                type: String,
            }
        ],
    },
    {
        collection: 'Transaction'
    }
)

const TransactionModel = mongoose.model("User", TransactionSchema);
export default TransactionModel;