import Joi from "joi";
import { gender as genderType } from "../../db/models/user.model.js";

export const fileObject = Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string(),
    filename: Joi.string(),
    path: Joi.string().required(),
    size: Joi.number().positive().required(),
});

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    ConfirmPassword: Joi.string().min(8).required().valid(Joi.ref("password")),
    userName: Joi.string().required(),
    phoneNumber: Joi.string().regex(/^01[0125][0-9]{8}$/).required(),
    gender: Joi.string().required().valid(...Object.values(genderType)),
    profile: Joi.array().items(fileObject).min(1).max(1).required(),
    coverImages: Joi.array().items(fileObject).max(4).optional(),
    video: Joi.array().items(fileObject).max(1).optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

export const confirmEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
})

export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
})

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().min(8).required(),
    ConfirmPassword: Joi.string().min(8).required().valid(Joi.ref("password")),
})


export const updateProfileSchema= Joi.object({
    userName: Joi.string(),
    phoneNumber: Joi.string().regex(/^01[0125][0-9]{8}$/),
    gender: Joi.string().valid(...Object.values(genderType)),
    profile: Joi.array().items(fileObject).max(1).optional(),
    coverImages: Joi.array().items(fileObject).max(4).optional(),
    video: Joi.array().items(fileObject).max(1).optional(),
})