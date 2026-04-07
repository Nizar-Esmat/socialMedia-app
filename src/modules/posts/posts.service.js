import Post from "../../db/models/post.model.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { massages } from "../../utils/messages/index.js";

export const createPost = async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.user;

    if (!content && !req.files?.images?.length && !req.files?.video?.[0]) {
        return next(new Error("Post must have content, an image, or a video.", { cause: 400 }));
    }

    const uploadedImages = [];
    if (req.files?.images?.length) {
        for (const file of req.files.images) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "socialMedia/posts/images",
            });
            uploadedImages.push({ secure_url: result.secure_url, public_id: result.public_id });
        }
    }

    let uploadedVideo = null;
    if (req.files?.video?.[0]) {
        const result = await cloudinary.uploader.upload(req.files.video[0].path, {
            folder: "socialMedia/posts/videos",
            resource_type: "video",
        });
        uploadedVideo = { secure_url: result.secure_url, public_id: result.public_id };
    }

    const post = await Post.create({
        content,
        images: uploadedImages,
        video: uploadedVideo,
        createdBy: id,
    });

    return res.status(201).json({ status: true, message: massages.message.created, data: post });
};


export const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const post = await Post.findOne({ _id: id, isDeleted: false });

    if (!post) {
        return next(new Error(massages.post.notFound + id, { cause: 404 }));
    }

    if (post.createdBy.toString() !== req.user.id) {
        return next(new Error("You are not authorized to update this post.", { cause: 403 }));
    }

    if (content) {
        post.content = content;
    }

    if (req.files?.images?.length) {
        for (const file of req.files.images) {
            if (file.public_id) {
                cloudinary.uploader.destroy(file.public_id);
            }
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "socialMedia/posts/images",
            });
            post.images.push({ secure_url: result.secure_url, public_id: result.public_id });
        }
    }

    if (req.files?.video?.[0]) {
        if (post.video?.public_id) {
            cloudinary.uploader.destroy(post.video.public_id, { resource_type: "video" });
        }
        const result = await cloudinary.uploader.upload(req.files.video[0].path, {
            folder: "socialMedia/posts/videos",
            resource_type: "video",
        });
        post.video = { secure_url: result.secure_url, public_id: result.public_id };
    }

    await post.save();

    return res.status(200).json({ status: true, message: massages.message.updated, data: post });
};


export const freezePost = async (req, res, next) => {
    const { id } = req.params;
    const condition = req.user.role === "admin" ? {} : { createdBy: req.user.id };
    const post = await Post.findOneAndUpdate({ _id: id, ...condition, isDeleted: false }, { isDeleted: true, deletedBy: req.user.id }, { new: true });

    if (!post) {
        return next(new Error(massages.post.notFound + id, { cause: 404 }));
    }

    return res.status(200).json({ status: true, message: massages.message.frozen, data: post });
};

export const unfreezePost = async (req, res, next) => {
    const { id } = req.params;
    const condition = req.user.role === "admin" ? {} : { createdBy: req.user.id };
    const post = await Post.findOneAndUpdate({ _id: id, ...condition, isDeleted: true, deletedBy: req.user.id }, { isDeleted: false, deletedBy: null }, { new: true });

    if (!post) {
        return next(new Error(massages.post.notFound + id, { cause: 404 }));
    }

    return res.status(200).json({ status: true, message: massages.message.unfrozen, data: post });
};

export const getUserFreezenPosts = async (req, res, next) => {
    const { id } = req.user;
    const posts = await Post.find({ createdBy: id, isDeleted: true, deletedBy: id }).sort({ createdAt: -1 });

    return res.status(200).json({ status: true, message: massages.message.success, data: posts });
};
export const likePost = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, isDeleted: false });
    if (!post) {
        return next(new Error(massages.post.notFound + id, { cause: 404 }));
    }
    const isLiked = post.likes.some((like) => like._id.toString() === req.user.id.toString());
    if (isLiked) {
        post.likes = post.likes.filter((like) => like._id.toString() !== req.user.id.toString());
    } else {
        post.likes.push({ _id: req.user.id });
    }
    await post.save();
    return res.status(200).json({ status: true, message: massages.message.success, data: post, isLiked: !isLiked });
};

export const getPosts = async (req, res, next) => {
    const posts = await Post.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .populate("createdBy", "username")
        .populate("likes", "username")
        .populate({
            path: "comments",
            populate: { path: "createdBy", select: "username" }
        });

    return res.status(200).json({ status: true, message: massages.message.success, data: posts });
};

export const getPostById = async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId, isDeleted: false })
        .populate("createdBy", "username")
        .populate("likes", "username")
        .populate({
            path: "comments",    
            populate: { path: "createdBy", select: "username" }
        });

    if (!post) {
        return next(new Error(massages.post.notFound + postId, { cause: 404 }));
    }

    return res.status(200).json({ status: true, message: massages.message.success, data: post });
};  