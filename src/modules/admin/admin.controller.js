import { Router } from "express";
import * as adminService from "./admin.service.js"
import * as uv from './admin.validation.js'
import { isAuthentecate } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { isAuthoraized } from "../../middlewares/authorization.middleware.js";

const router = Router();

router.get("/users",
    isAuthentecate,
    isAuthoraized(["admin"]),
    asyncHandler(adminService.getUsers));



router.patch("/users/:userId/role",
    isAuthentecate,
    isAuthoraized(["admin"]),
    asyncHandler(adminService.updateUserRole));

export default router;
