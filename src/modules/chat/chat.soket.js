import { Server } from "socket.io";
import { authenticateSocket } from "../../middlewares/auth.middleware.js";
import { disconnectAuthSocket, rigsterAuthSocket } from "./service/chat.sokcet.service.js";
import { sendMassage } from "./service/massage.service.js";


export const connectIO = async (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
        }
    });


    io.on("connection", async (socket) => {
        console.log("a user connected with id ", socket.id);
        await rigsterAuthSocket(socket);

        await sendMassage(socket);
        await disconnectAuthSocket(socket);
    });

}