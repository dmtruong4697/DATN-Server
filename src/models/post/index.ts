import { timeStamp } from "console";
import mongoose, { Schema, model } from "mongoose";

const PostSchema = new Schema(
    {
        createAt: {
            type: String,
        },
        userId: {
            type: Object,
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
                userId: Object,
            }
        ],
        downvote: [
            {
                time: String,
                userId: Object,
            }
        ],
        comment: [
            {
                time: String,
                userId: Object,
                content: String,
            }
        ],
    },
    {
        collection: 'Post'
    }
)

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;