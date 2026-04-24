import express from "express";
import bootStrap from "./src/app.controller.js";
import { Server } from "socket.io";
import http from "http";
import { connect } from "http2";
import { connectIO } from "./src/modules/chat/chat.soket.js";

const app = express();
const server = http.createServer(app);



connectIO(server).then(() => {
    console.log("io connected");
}).catch((error) => {
    console.log("io connection error ", error);
});

bootStrap(app, express);

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log("server is running on port ", PORT);
});