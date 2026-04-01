import Joi from "joi";

export const updateUserSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
});

export const updateEmailSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const confirmUpdateEmailSchema = Joi.object({
    newEmailOtp: Joi.string().length(6).required(),
    oldEmailOtp: Joi.string().length(6).required(),
});