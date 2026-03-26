import Joi from "joi";
import { gender as genderType } from "../../db/models/user.model.js";
export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    ConfirmPassword: Joi.string().min(8).required().valid(Joi.ref("password")),
    userName: Joi.string().required(),
    phoneNumber: Joi.string().regex(/^01[0125][0-9]{8}$/).required(),
    gender: Joi.string().required().valid(...Object.values(genderType)),
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