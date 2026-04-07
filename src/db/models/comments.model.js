import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        content: { type: String },
        images: [
            {
                secure_url: { type: String },
                public_id: { type: String },
            },
        ],
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isDeleted: { type: Boolean, default: false },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Comment = model("Comment", commentSchema);
export default Comment;
