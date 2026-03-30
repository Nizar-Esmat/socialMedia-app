import { Router } from "express";
import * as authService from "./auth.service.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as av from "./auth.validation.js";
import { filetype, uploadFileHost } from "../../middlewares/multer.middleware.js";
import { isAuthentecate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",
    uploadFileHost([...filetype.images, ...filetype.videos]).fields([{ name: "coverImages", maxCount: 4 }, { name: "profile", maxCount: 1 }, { name: "video", maxCount: 1 }]),
    isValid(av.registerSchema),
    asyncHandler(authService.register))

router.post("/confirm", isValid(av.confirmEmailSchema), asyncHandler(authService.confirmEmail));

router.post("/login",
    isValid(av.loginSchema),
    asyncHandler(authService.login));

router.get("/refresh_token", isValid(av.refreshTokenSchema), asyncHandler(authService.refreshToken));

router.patch("/forget_password", isValid(av.forgetPasswordSchema), asyncHandler(authService.forgetPassword));

router.patch("/reset_password", isValid(av.resetPasswordSchema), asyncHandler(authService.resetPassword));

router.patch(
    "/update_profile",
    uploadFileHost([...filetype.images, ...filetype.videos]).fields([{ name: "coverImages", maxCount: 4 }, { name: "profile", maxCount: 1 }, { name: "video", maxCount: 1 }]),
    isValid(av.updateProfileSchema),
    isAuthentecate,
    asyncHandler(authService.updateProfile));
export default router;
