import { Router } from "express";
import * as commentService from "./comment.service.js";
import * as uv from "./comment.validation.js";
import { isAuthentecate } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { uploadFileHost, filetype } from "../../middlewares/multer.middleware.js";

const router = Router({ mergeParams: true });

const upload = uploadFileHost([...filetype.images]);

router.post("/", isAuthentecate, upload.array("media", 6), isValid(uv.createCommentSchema), asyncHandler(commentService.createComment));

router.patch("/:commentId", isAuthentecate, upload.array("media", 6), isValid(uv.updateCommentSchema), asyncHandler(commentService.updateComment));

export default router;

