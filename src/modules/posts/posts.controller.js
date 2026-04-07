import { Router } from "express";
import * as postService from "./posts.service.js";
import * as uv from "./posts.validation.js";
import { isAuthentecate } from "../../middlewares/auth.middleware.js";
import asyncHandler from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { uploadFileHost, filetype } from "../../middlewares/multer.middleware.js";
import commentRouter from "../comments/comment.controller.js";

const router = Router();

router.use("/:postId/comments" , commentRouter);

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


router.delete("/:postId",
    isAuthentecate,
    asyncHandler(postService.freezePost));

router.patch("/restore/:postId",
    isAuthentecate,
    asyncHandler(postService.unfreezePost));

router.get("/userFreePosts",
    isAuthentecate,
    asyncHandler(postService.getUserFreezenPosts));

router.patch("/like/:postId",
    isAuthentecate,
    asyncHandler(postService.likePost));

router.get("/posts" , isAuthentecate , asyncHandler(postService.getPosts));
router.get("/post/:postId" , asyncHandler(postService.getPostById));

export default router;

