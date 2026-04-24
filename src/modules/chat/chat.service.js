import { authenticateSocket } from "../../middlewares/auth.middleware.js";

export const userConnectedSockets = new Map();

export const rigsterAuthSocket = async (socket) => {
    const data = await authenticateSocket({ socket });
    if (!data || data.status === false) {
        socket.emit("unauthorized", { message: data?.massage });
        socket.disconnect();
        return;
    }
    userConnectedSockets.set(socket.id, data._id);
    socket.emit("authorized", { message: "authorized" });
    return "authorized";
}


export const disconnectAuthSocket = (socket) => {
    return socket.on("disconnect", async () => {
        const data = await authenticateSocket({ socket });
        if (!data.status) {
            socket.emit("unauthorized", { message: data.massage });
            socket.disconnect();
        }
        userConnectedSockets.delete(socket.id);
        return "disconnected";
    });
}