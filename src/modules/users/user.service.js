import OTP from "../../db/models/otp.model.js";
import User from "../../db/models/user.model.js";
import { massages } from "../../utils/messages/index.js";
import { compare, Decrypt, emailEmitter, encrypt } from "../../utils/index.js";
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

    const user = await User.findById({ _id: id, isDeleted: false });

    if (!user) {
        return next(new Error(massages.user.notFound + id, { cause: 404 }));
    }

    if (user.id == req.user.id) {
        return res.status(200).json({ status: true, message: massages.user.fetch, data: user });
    }

    const userExist = user.viwers.find((viewer) => viewer._id.toString() === req.user.id.toString());

    if (userExist) {
        userExist.time.push(Date.now());
        if (userExist.time.length > 5) {
            userExist.time = userExist.time.slice(-5);
        }
    } else {
        user.viwers.push({ _id: req.user.id, time: [Date.now()] });
    }

    await user.save();

    return res.status(200).json({ status: true, message: massages.user.fetch, data: user });
}

export const updateEmail = async (req, res, next) => {
    const { email } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
        return next(new Error(massages.user.notFound, { cause: 404 }));
    }

    const emailTaken = await User.findOne({ email, isDeleted: false });
    if (emailTaken) {
        return next(new Error(massages.user.emailExist, { cause: 409 }));
    }

    if (email === user.email) {
        return next(new Error(massages.user.emailSame, { cause: 409 }));
    }

    user.pendingEmail = email;
    await user.save();

    emailEmitter.emit("sendEmail", {
        email,
        subject: "verify your new email",
        type: "updateEmail",
    });

    emailEmitter.emit("sendEmail", {
        email: user.email,
        subject: "email update requested",
        type: "updateEmail",
    });

    return res.status(200).json({ status: true, message: massages.user.otpSent });
};

export const confirmUpdateEmail = async (req, res, next) => {
    const { newEmailOtp, oldEmailOtp } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user || !user.pendingEmail) {
        return next(new Error(massages.user.notFound, { cause: 404 }));
    }

    const newOtpRecord = await OTP.findOne({ email: user.pendingEmail, type: "updateEmail" });
    if (!newOtpRecord) {
        return next(new Error(massages.user.otpNotFound, { cause: 404 }));
    }

    const oldOtpRecord = await OTP.findOne({ email: user.email, type: "updateEmail" });
    if (!oldOtpRecord) {
        return next(new Error(massages.user.otpNotFound, { cause: 404 }));
    }

    const isNewMatch = compare({ password: newEmailOtp, hash: newOtpRecord.otp });
    if (!isNewMatch) {
        return next(new Error(massages.user.otpInvalid, { cause: 400 }));
    }

    const isOldMatch = compare({ password: oldEmailOtp, hash: oldOtpRecord.otp });
    if (!isOldMatch) {
        return next(new Error(massages.user.otpInvalid, { cause: 400 }));
    }

    const newEmail = user.pendingEmail;
    const oldEmail = user.email;
    user.email = newEmail;
    user.pendingEmail = undefined;
    await user.save();

    await OTP.deleteMany({ email: { $in: [newEmail, oldEmail] }, type: "updateEmail" });

    return res.status(200).json({ status: true, message: massages.user.emailUpdated });
};