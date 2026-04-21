import User from "../../../db/models/user.model.js";

export const getOneUserResolve = async (parent, args, context) => {
    const { id } = args;
    const user = await User.findById(id);
    return user;
};

export const getAllUsersResolve = async (parent, args, context) => {
    const users = await User.find();
    return users;
};
