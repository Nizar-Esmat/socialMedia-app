import Post from "../../../db/models/post.model.js";
import { authenticateGraphQL } from "../../../middlewares/auth.middleware.js";
import { validationGraphQL } from "../../../middlewares/validation.middleware.js";
import { likePostSchema } from "../posts.validation.js";

export const getPostsResolve = async (parent, args, context) => {
    const { id } = args;
    const post = await Post.findById(id);
    return post;
}

export const getAllPostsResolve = async (parent, args, context) => {
    const posts = await Post.find().populate([
        { path: "createdBy", select: "username" },
        { path: "comments", populate: { path: "createdBy", select: "username" } },
    ]);
    return posts;
}
export const likePostResolve = async (parent, args, context) => {

    await validationGraphQL({schema: likePostSchema, data: args});
    const { postId: id } = args;
    const user = await authenticateGraphQL({authorization: context.authorization});
    const post = await Post.findOne({ _id: id, isDeleted: false });
    if (!post) {
        throw new Error(massages.post.notFound + id);
    }
    const isLiked = post.likes.some((like) => like._id.toString() === user.id.toString());
    if (isLiked) {
        post.likes = post.likes.filter((like) => like._id.toString() !== user.id.toString());
    } else {
        post.likes.push({ _id: user.id });
    }
    await post.save();
    return res.status(200).json({ status: true, message: massages.message.success, data: post, isLiked: !isLiked });
}  