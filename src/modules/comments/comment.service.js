import Comment from "../../db/models/index.js";
import Post from "../../db/models/index.js";

export const createComment = async (req, res, next) => {
    const { content, postId } = req.body;
    const { id } = req.user;


    const post = await Post.findOne({ _id: postId, isDeleted: false });
    if (!post) {
        return next(new Error(massages.post.notFound + postId, { cause: 404 }));
    }

    let uploadedImages = [];

    if (req.files?.images?.length) {
        for (const file of req.files.images) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "socialMedia/comments/images",
            });
            uploadedImages.push({ secure_url: result.secure_url, public_id: result.public_id });
        }
    }



    const commentData = {
        content,
        images: uploadedImages,
        postId,
        createdBy: id,
    };

    const comment = await Comment.create(commentData);

    return res.status(201).json({ status: true, message: "Comment created successfully.", data: comment });

}


export const updateComment = async (req, res, next) => {
    const { commentId, postId } = req.params;

    const { content } = req.body;

    const comment = await Comment.findOne
        (
            {
                _id: commentId,
                postId,
                isDeleted: false,
                createdBy: req.user.id
            }
        ).populate("postId");

    if (!comment) {
        return next(new Error(massages.comment.notFound + commentId, { cause: 404 }));
    }

    if (content) {
        comment.content = content;
    }

    if (req.files?.images?.length) {
        let uploadedImages = [];
        for (const file of req.files.images) {
            if (file.public_id) {
                cloudinary.uploader.destroy(file.public_id);
            }
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "socialMedia/comments/images",
            });
            uploadedImages.push({ secure_url: result.secure_url, public_id: result.public_id });
        }
        comment.images = uploadedImages;
    }

    await comment.save();

    return res.status(200).json({ status: true, message: "Comment updated successfully.", data: comment });
}


export const freezeComment = async (req, res, next) => {
    const { commentId, postId } = req.params;

    const comment = await Comment.findOne({ _id: commentId, postId, isDeleted: false }).populate("postId");
    if (!comment) {
        return next(new Error(massages.comment.notFound + commentId, { cause: 404 }));
    }

    if (req.user.id !== comment.createdBy.toString() &&
        req.user.role !== "admin" &&
        req.user.id !== comment.postId.createdBy.toString()) {
        return next(new Error("You are not authorized to freeze this comment.", { cause: 403 }));
    }

    comment.isDeleted = true;
    await comment.save();
    return res.status(200).json({ status: true, message: "Comment frozen successfully.", data: comment });
}