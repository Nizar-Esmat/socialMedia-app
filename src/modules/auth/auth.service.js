import User from "../../db/models/user.model.js";
import { sendEmail, compare, encrypt, genrateTokens, hash, verifyToken } from "../../utils/index.js";
import { massages } from "../../utils/messages/index.js";


export const register = async (req, res, next) => {
  const { email, password, userName, phoneNumber, gender } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new Error(massages.user.alreadyExists, { cause: 409 }));
  }

  const newUser = await User.create({
    email,
    password: hash({ password }),
    userName,
    phoneNumber: encrypt({ data: phoneNumber }),
    gender,
  });
  const verifyToken = genrateTokens({
    payload: {
      userId: newUser.id
    },
    options: {
      expiresIn: "1d"
    }
  })
  const link = `http://localhost:3000/auth/verify/${verifyToken}`;
  const isSent = await sendEmail({
    email,
    subject: "verify your email",
    message: `click on this link to verify your email `,
    html: `<a href="${link}">click here to verify your email</a>`
  })
  if (!isSent) {
    return next(new Error("email did not sent", { cause: 500 }));
  }

  const sendData = {
    userName: newUser.userName,
    email: newUser.email,
    phoneNumber: CryptoJS.AES.decrypt({ data: newUser.phoneNumber }),
    gender: newUser.gender,
  }

  return res.status(201).json({ status: true, message: massages.user.created, data: sendData });
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
    return next(new Error(massages.user.notFound + "verified email", { cause: 401 }));
  }

  const token = genrateTokens({
    payload: {
      userId: user.id
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
    phoneNumber: CryptoJS.AES.decrypt(user.phoneNumber, process.env.CryptoJSKey).toString(CryptoJS.enc.Utf8),
    gender: user.gender,
    id: user.id
  }
  return res
    .status(200)
    .json({ status: true, message: massages.user.fetch, token, data: sendData });
}



export const verify = async (req, res, next) => {
  const { token } = req.params;
  const { userId, error } = verifyToken({ token });
  if (error) {
    return next(error);
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new Error(massages.user.notFound + userId, { cause: 404 }));
  }
  user.isConfirmed = true;
  await user.save();
  return res.status(200).json({ status: true, message: massages.user.updated });
}