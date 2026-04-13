import { promises } from "nodemailer/lib/xoauth2";
import Post from "../../db/models/post.model";
import User from "../../db/models/user.model";

export const getUsers = async (req, res) => {
    const { page, limit } = req.query;

    const data = await promises.all([
        Post.find().skip((page - 1) * limit).limit(limit),
        User.find().skip((page - 1) * limit).limit(limit)
    ])
    res.json(
        {
            message: "Users retrieved successfully",
            data
        }
    );
};

export const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const data = req.user.role === "super-admin" ? { role: { $nin: ["super-admin"] } } : { role: { $nin: ["super-admin", "admin"] } };;
    const user = await User.findByIdAndUpdate(userId, { role },  data,  { new: true });

    res.json(
        {
            message: "User role updated successfully",
            data: user
        }
    );
}