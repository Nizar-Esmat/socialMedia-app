import dbConnect from "./db/connections.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/users/user.controller.js";
import postController from "./modules/posts/posts.controller.js";
import adminController from "./modules/admin/admin.controller.js";
import ChatController from  "./modules/chat/chat.controller.js";
import { globalError } from "./utils/error/global-error.js";
import { notFOund } from "./utils/error/not-found.js";
import path from "path";
import { createHandler } from 'graphql-http/lib/use/express';
import rateLimit from "express-rate-limit";
import schema from "./modules/graph.schema.js";
import cors from "cors";
import { authenticateSocket } from "./middlewares/auth.middleware.js";


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  statusCode: 429,
  message: "Too many requests from this IP, please try again after 15 minutes",
})


const bootStrap = async (app, express, io) => {

  app.use(cors());

  app.use(express.static(path.resolve("public")));
  app.use(express.json());
  app.use(limiter);

  await dbConnect();
  app.get("/", (req, res, next) => {
    res.send("hello world");
  });
  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/post", postController);
  app.use("/admin", adminController);
  app.use("/chat" , ChatController);

  app.use('/graphql', createHandler({ schema }));






  app.use(notFOund);
  app.use(globalError);
};

export default bootStrap;