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


router.get("/share-profile",
        isAuthentecate,
        asyncHandler(userService.shareProfile)
)

router.patch("/update-email",
    isAuthentecate,
    isValid(uv.updateEmailSchema),
    asyncHandler(userService.updateEmail));

router.patch("/confirm-update-email",
    isAuthentecate,
    isValid(uv.confirmUpdateEmailSchema),
    asyncHandler(userService.confirmUpdateEmail));


router.patch("/add-friend",
    isAuthentecate,
    isValid(uv.addFriendSchema),
    asyncHandler(userService.addFriend));

router.patch("/remove-friend",
    isAuthentecate,
    isValid(uv.removeFriendSchema),
    asyncHandler(userService.removeFriend));

export default router;
