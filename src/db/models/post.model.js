import { Schema, model } from "mongoose";

const postSchema = new Schema(
    {
        content: { type: String },
        images: [
            {
                secure_url: { type: String },
                public_id: { type: String },
            },
        ],
        video: {
            secure_url: { type: String },
            public_id: { type: String },
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Post = model("Post", postSchema);
export default Post;
