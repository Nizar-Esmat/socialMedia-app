import Joi from "joi";
import { gender as genderType } from "../../db/models/user.model.js";
export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    userName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    gender: Joi.string().required().valid(...Object.values(genderType)),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});