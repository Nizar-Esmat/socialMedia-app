import CryptoJS from "crypto-js";
import User from "../../db/models/user.model.js";
import { massages } from "../../utils/messages/index.js";
export const getMe = async (req, res, next) => {
    let { user } = req;
    user.phoneNumber = CryptoJS.AES.decrypt(user.phoneNumber, process.env.CryptoJSKey).toString(CryptoJS.enc.Utf8);
    return res.status(200).json({ status: true, message: massages.user.fetch, data: user });
};

export const freezeAccount = async (req, res, next) => {
    const { id } = req.user;
    const opreation = await User.findByIdAndUpdate(id, { isDeleted: true, deletedAt: Date.now() });
    return res.status(200).json({ status: true, message: massages.user.deleted, data: opreation });
};