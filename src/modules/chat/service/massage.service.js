import Chat from "../../../db/models/chat.model.js";
import { authenticateSocket } from "../../../middlewares/auth.middleware.js";
import { userConnectedSockets } from "./chat.sokcet.service.js";

export const sendMassage = async (soket) => {
    soket.on("sendMessage", async (massageInfo) => {
        console.log("sendMassage"  , massageInfo);
        const { message, destId } = massageInfo;
        const data = await authenticateSocket({ socket: soket });
        if (!data || data.status === false) {
            soket.emit("unauthorized", { message: data?.massage });
            soket.disconnect();
            return;
        }
        const userId = data.user._id;

        const chat = await Chat.findOneAndUpdate(
            {
                $or: [
                    { mainUser: userId, subBarticibant: destId },
                    { mainUser: destId, subBarticibant: userId }
                ]
            },
            {
                $push: {
                    massage: { senderId: userId, massage: message }
                }
            },
            { returnDocument: 'after' }
        );

        if (!chat) {
            await Chat.create({
                mainUser: userId,
                subBarticibant: destId,
                massage: [{ senderId: userId, massage: message }]
            });
        }

        soket.emit("successMessage", { message });
        const destSocketId = userConnectedSockets.get(destId.toString());
        if (destSocketId) {
            soket.to(destSocketId).emit("receiveMassage", { message });
        }
    })
}