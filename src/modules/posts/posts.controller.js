import { Router } from "express";
import * as postService from "./posts.service.js";
import * as uv from "./posts.validation.js";
import { isAuthentecate } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { uploadFileHost, filetype } from "../../middlewares/multer.middleware.js";

const router = Router();

const upload = uploadFileHost([...filetype.images, ...filetype.videos]);

router.post("/",
    upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]),
    isAuthentecate,
    isValid(uv.createPostSchema),
    asyncHandler(postService.createPost));

router.patch("/:postId",
    upload.fields([{ name: "images", maxCount: 5 }, { name: "video", maxCount: 1 }]),
    isAuthentecate,
    isValid(uv.updatePostSchema),
    asyncHandler(postService.updatePost));


export default router;

