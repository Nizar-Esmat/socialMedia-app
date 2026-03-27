import { Router } from "express";
import * as authService from "./auth.service.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as av from "./auth.validation.js";
import { filetype, uploadFile } from "../../middlewares/multer.middleware.js";

const router = Router();

router.post("/register",
    isValid(av.registerSchema),
    asyncHandler(authService.register))

router.post("/confirm", isValid(av.confirmEmailSchema) , asyncHandler(authService.confirmEmail));

router.post("/login", 
    isValid(av.loginSchema)  , 
    asyncHandler(authService.login));

router.get("/refresh_token", isValid(av.refreshTokenSchema) , asyncHandler(authService.refreshToken));

router.patch("/forget_password", isValid(av.forgetPasswordSchema) , asyncHandler(authService.forgetPassword));

router.patch("/reset_password", isValid(av.resetPasswordSchema) , asyncHandler(authService.resetPassword));

router.post('/uploadFIle' , uploadFile([...filetype.images], "images").single("profile")  ,asyncHandler(authService.uploadFile));

export default router;
