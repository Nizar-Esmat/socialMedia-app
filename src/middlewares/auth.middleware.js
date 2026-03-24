import jwt from "jsonwebtoken";
import User from "../db/models/user.model.js";
import { massages } from "../utils/messages/index.js";
export const isAuthentecate = async (req, res, next) => {
    try {
        const { autherization } = req.headers;
        if(!autherization) {
            return res.status(401).json({ status: false, message: massages.auth.tokenRequired });
        }
        if (!autherization.startsWith("Bearer ")) {
            return res.status(401).json({ status: false, message: massages.auth.invalidBearer });
        }
        const [bearer, token] = autherization.split(" ");
        if (!token) {
            return res.status(401).json({ status: false, message: massages.auth.unauthorized });
        }
        const { userId , iat } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ status: false, message: massages.auth.unauthorized });
        }
        if (user.isDeleted) {
            return res.status(401).json({ status: false, message: massages.auth.unauthorized });
        }
        if (user.deletedAt && user.deletedAt.getTime() > iat * 1000) {
            return res.status(401).json({ status: false, message: massages.auth.unauthorized });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ status: false, message: massages.auth.serverError });
    }
}