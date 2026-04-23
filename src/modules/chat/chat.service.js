export const userConnectedSockets = new Map();

export const rigsterAuthSocket = async (socket) => {
    const data = await authenticateSocket({ socket });
    if (!data.status) {
        socket.emit("unauthorized", { message: data.massage });
        socket.disconnect();
    }
    userConnectedSockets.set(socket.id, data.user._id.toString());
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