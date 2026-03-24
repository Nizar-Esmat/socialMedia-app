import { Router } from "express";
import * as authService from "./auth.service.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();

router.post("/register",
    isValid(authValidation.registerSchema),
    asyncHandler(authService.register))


router.post("/login", isValid(authValidation.loginSchema)  , asyncHandler(authService.login));

router.get("/verify/:token", asyncHandler(authService.verify));
export default router;
