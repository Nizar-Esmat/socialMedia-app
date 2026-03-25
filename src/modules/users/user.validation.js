import Joi from "joi";

export const updateUserSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
});