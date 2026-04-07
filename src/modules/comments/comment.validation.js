import Joi from "joi";
import { fileObject } from "../auth/auth.validation.js";

export const createCommentSchema = Joi.object({
    content: Joi.string().min(1).max(500),
    images: Joi.array().items(fileObject).max(5).optional(),
    video: Joi.array().items(fileObject).max(1).optional(),
}).or("content", "images", "video");

export const updateCommentSchema = Joi.object({
    content: Joi.string().min(1).max(500),
    images: Joi.array().items(fileObject).max(5).optional(),
    video: Joi.array().items(fileObject).max(1).optional(),
}).or("content", "images", "video");