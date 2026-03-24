import asyncHandler from "../utils/error/async-handler.js";
import { Types } from "mongoose";

export const isValid = (schema) => {
    return asyncHandler(async (req, res, next) => {
        const data = {...req.body, ...req.params, ...req.query}
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            return next(new Error(error.message, { cause: 400 }));
        }
        next();
    });
}


export const isValidId = ((value, helper) => {
    if (!Types.ObjectId.isValid(value)) {
        return helper.message("invalid id");
    }
    return true;
})