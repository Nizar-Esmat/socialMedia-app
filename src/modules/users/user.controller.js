import { Router } from "express";
import * as userService from "./user.service.js"
import * as uv from './user.validation.js'
import { isAuthentecate } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";

const router = Router();

router.get("/",
    isAuthentecate,
    asyncHandler(userService.getMe));

router.delete("/freeze",
    isAuthentecate,
    asyncHandler(userService.freezeAccount));

router.put("/update-user",
    isAuthentecate,
    isValid(uv.updateUserSchema),
    asyncHandler(userService.updateUser));

export default router;
