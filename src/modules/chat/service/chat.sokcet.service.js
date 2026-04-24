import { authenticateSocket } from "../../../middlewares/auth.middleware.js";

export const userConnectedSockets = new Map();

export const rigsterAuthSocket = async (socket) => {
    const data = await authenticateSocket({ socket });
    if (!data || data.status === false) {
        socket.emit("unauthorized", { message: data?.massage });
        socket.disconnect();
        return;
    }
    userConnectedSockets.set(data.user._id.toString(), socket.id);
    socket.emit("authorized", { message: "authorized" });
    return "authorized";
}


export const disconnectAuthSocket = (socket) => {
    return socket.on("disconnect", () => {
        for (const [userId, socketId] of userConnectedSockets.entries()) {
            if (socketId === socket.id) {
                userConnectedSockets.delete(userId);
                break;
            }
        }
        return "disconnected";
    });
}