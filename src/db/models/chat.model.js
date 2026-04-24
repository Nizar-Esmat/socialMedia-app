import { Schema, model } from "mongoose";

const chatSchema = new Schema(
    {

        mainUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subBarticibant: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        massage: [{
            massage: { type: String , required: true},
            senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        }],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);



const Chat = model("Chat", chatSchema);
export default Chat;
