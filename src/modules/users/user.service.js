import CryptoJS from "crypto-js";
import User from "../../db/models/user.model.js";
import { massages } from "../../utils/messages/index.js";
import { Decrypt, encrypt } from "../../utils/index.js";
export const getMe = async (req, res, next) => {
    let { user } = req;
    user.phoneNumber = Decrypt({ data: user.phoneNumber });
    return res.status(200).json({ status: true, message: massages.user.fetch, data: user });
};

export const updateUser = async (req, res, next) => {
    const { username, email, phoneNumber } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
        return next(new Error(massages.user.notFound + id, { cause: 404 }));
    }
    if (username) {
        user.userName = username;
    }
    if (email) {
        user.email = email;
    }
    if (phoneNumber) {
        user.phoneNumber = encrypt({ data: phoneNumber });
    }

    await user.save();

    return res.status(200).json({ status: true, message: massages.user.updated, data: user });
}

export const freezeAccount = async (req, res, next) => {
    const { id } = req.user;
    const opreation = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: Date.now() });
    return res.status(200).json({ status: true, message: massages.user.deleted, data: opreation });
};
export const shareProfile = async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById({ _id: id, isDeleted: false});

    if (!user) {
        return next(new Error(massages.user.notFound + id, { cause: 404 }));
    }

    if(user.id == req.user.id){
        return res.status(200).json({ status: true, message: massages.user.fetch, data: user });
    }

    const userExist = user.viwers.find((viewer) => viewer._id.toString() === req.user.id.toString());
    
    if (userExist) {
        userExist.time.push(Date.now());
        if(userExist.time.length > 5){
            userExist.time() = userExist.time.slice(-5);
        }
    } else {
        user.viwers.push({ _id: req.user.id, time: [Date.now()] });
    }

    await user.save();

    return res.status(200).json({ status: true, message: massages.user.fetch, data: user });
}