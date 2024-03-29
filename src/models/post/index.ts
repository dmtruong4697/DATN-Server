import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const PostSchema = new Schema(
    {
        createAt: {
            type: String,
        },
        userId: {
            type: String,
        },
        content: {
            type: String,
        },
        imageUrl: [
            {
                type: String,
            }
        ],
        upvote: [
            {
                time: String,
                userId: String,
            }
        ],
        downvote: [
            {
                time: String,
                userId: String,
            }
        ],
        comment: [
            {
                time: String,
                userId: String,
                content: String,
            }
        ],
    },
    {
        collection: 'Post'
    }
)

const PostModel = mongoose.model("User", PostSchema);
export default PostModel;