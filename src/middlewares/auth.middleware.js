import jwt from "jsonwebtoken";
import User from "../db/models/user.model.js";
import { massages } from "../utils/messages/index.js";
export const isAuthentecate = async (req, res, next) => {
    try {
        const { autherization } = req.headers;
        if (!autherization) {
            return next(new Error(massages.auth.tokenRequired, { cause: 401 }));
        }
        if (!autherization.startsWith("Bearer ")) {
            return next(new Error(massages.auth.invalidBearer, { cause: 401 }));
        }
        const [bearer, token] = autherization.split(" ");
        if (!token) {
            return next(new Error(massages.auth.unauthorized, { cause: 401 }));
        }
        const { userId , iat } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId);

        if (!user) {
            return next(new Error(massages.auth.unauthorized, { cause: 401 }));
        }
        if (user.isDeleted) {
            return next(new Error(massages.auth.unauthorized, { cause: 401 }));
        }
        if (user.deletedAt && user.deletedAt.getTime() > iat * 1000) {
            return next(new Error(massages.auth.unauthorized, { cause: 401 }));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new Error(error.message, { cause: 500 }));
    }
}