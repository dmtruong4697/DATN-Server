import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const TransactionSchema = new Schema(
    {
        userId: {
            type: Object,
        },
        groupId: {
            type: Object,
        },
        currencyUnit: {
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
        createTime: {
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

const TransactionModel = mongoose.model("Transaction", TransactionSchema);
export default TransactionModel;