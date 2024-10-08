import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const UserDataSchema = new Schema(
    {
        userId: {
            type: Object,
        },
        loans: [
            {
                type: Object,
            }
        ],
        transactions: [
            {
                type: Object,
            }
        ],
        wallets: [
            {
                type: Object,
            }
        ],
        transactionTypes: [
            {
                type: Object,
            }
        ],
        budgets: [
            {
                type: Object,
            }
        ],
        savings: [
            {
                type: Object,
            }
        ],
        shoppingLists: [
            {
                type: Object,
            }
        ],
        shoppingListItems: [
            {
                type: Object,
            }
        ],
    },
    {
        collection: 'UserData'
    }
)

const UserDataModel = mongoose.model("UserData", UserDataSchema);
export default UserDataModel;