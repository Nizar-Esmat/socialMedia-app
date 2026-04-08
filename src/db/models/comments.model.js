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
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isDeleted: { type: Boolean, default: false },
        deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
        refId: { type: Schema.Types.ObjectId, ref: "onModel" },
        onModel : {
            typs : string,
            enum : ["post" , "comment"],
            require : true
        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
);




const Comment = model("Comment", commentSchema);
export default Comment;
