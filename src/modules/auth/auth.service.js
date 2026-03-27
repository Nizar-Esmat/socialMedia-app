import OTP from "../../db/models/otp.model.js";
import User from "../../db/models/user.model.js";
import { emailEmitter, compare, encrypt, genrateTokens, verifyToken, Decrypt, hash } from "../../utils/index.js";
import { massages } from "../../utils/messages/index.js";

export const register = async (req, res, next) => {
  const { email, password, userName, phoneNumber, gender } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new Error(massages.user.alreadyExists, { cause: 409 }));
  }

  const hashedPassword = hash({ password });

  const newUser = await User.create({
    email,
    password: hashedPassword,
    ConfirmPassword: hashedPassword,
    userName,
    phoneNumber: encrypt({ data: phoneNumber }),
    gender,
  });

  emailEmitter.emit("sendEmail", {
    email,
    subject: "verify your email",
    type: "confirmEmail"
  });

  return res.status(201).json({ status: true, message: massages.user.created, data: newUser });
}

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, isConfirmed: false });
  if (!user) {
    return next(new Error(massages.user.notFound, { cause: 404 }));
  }
  const oldOTP = await OTP.findOne({ email, type: "confirmEmail" });
  if (!oldOTP) {
    return next(new Error(massages.user.otpNotFound, { cause: 404 }));
  }

  const isMatch = compare({ password: otp, hash: oldOTP.otp });
  if (!isMatch) {
    return next(new Error(massages.user.otpInvalid, { cause: 400 }));
  }

  user.isConfirmed = true;
  await user.save();
  return res.status(200).json({ status: true, message: massages.user.emailConfirmed, data: user });
}

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error(massages.user.invalidCredentials, { cause: 401 }));
  }
  const isMatch = compare({ password, hash: user.password });
  if (!isMatch) {
    return next(new Error(massages.user.invalidCredentials, { cause: 401 }));
  }

  if (user.isConfirmed === false) {
    return next(new Error(massages.user.emailNotConfirmed, { cause: 403 }));
  }

  const accessToken = genrateTokens({
    payload: {
      userId: user.id,
      userEmail: user.email
    },
    options: {
      expiresIn: "1h"
    }
  })

  const refreshToken = genrateTokens({
    payload: {
      userId: user.id,
      userEmail: user.email
    },
    options: {
      expiresIn: "1d"
    }
  })



  if (user.isDeleted) {
    await User.findByIdAndUpdate(user.id, { isDeleted: false });
  }

  const sendData = {
    userName: user.userName,
    email: user.email,
    phoneNumber: Decrypt({ data: user.phoneNumber }),
    id: user.id
  }
  return res
    .status(200)
    .json({
      status: true,
      message: massages.user.loggedIn,
      access_tokaen: accessToken,
      refresh_token: refreshToken,
      data: sendData
    });
}

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const { userId, userEmail, error } = verifyToken({ token: refreshToken });
  if (error) {
    return next(error);
  }

  const newToken = genrateTokens({
    payload: {
      userId,
      userEmail
    },
    options: {
      expiresIn: "1h"
    }
  })

  return res.status(200).json({ status: true, message: massages.user.tokenRefreshed, access_tokaen: newToken });
}

export const forgetPassword = async (req , res ,next) =>{
  const {email} = req.body;
  const user = await User.findOne({email, isDeleted: false});
  if(!user){
    return next(new Error(massages.user.notFound + email, { cause: 404 }));
  }
  emailEmitter.emit("sendEmail", {
    email,
    subject: "reset your password",
    type: "forgetPassword"
  });
  return res.status(200).json({ status: true, message: massages.user.otpSent });
}

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email, isDeleted: false });
  if (!user) {
    return next(new Error(massages.user.notFound + email, { cause: 404 }));
  }
  const oldOTP = await OTP.findOne({ email, type: "forgetPassword" });
  if (!oldOTP) {
    return next(new Error(massages.user.otpNotFound, { cause: 404 }));
  }

  const isMatch = compare({ password: otp, hash: oldOTP.otp });
  if (!isMatch) {
    return next(new Error(massages.user.otpInvalid, { cause: 400 }));
  }

  user.password = hash({ password });
  await user.save();
  return res.status(200).json({ status: true, message: massages.user.passwordReset });
}

export const uploadFile = (req, res ,next)=>{
  console.log(req.file);
  return res.status(200).json({ status: true, data: req.file });
}