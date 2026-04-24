import { Router } from "express";
import * as chatService from "./service/chat.service.js";
import { isAuthentecate } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/error/async-handler.js";

const router = Router();



router.get("/:userId",
    isAuthentecate,
    asyncHandler(chatService.getChat));



export default router;