import jwt from "jsonwebtoken";
import User from "../db/models/user.model.js";
import { massages } from "../utils/messages/index.js";
export const isAuthentecate = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({ status: false, massage: massages.auth.tokenRequired });
        }
        if (!authorization.startsWith("Bearer ")) {
            return res.status(401).json({ status: false, massage: massages.auth.invalidBearer });
        }
        const [bearer, token] = authorization.split(" ");
        if (!token) {
            return res.status(401).json({ status: false, massage: massages.auth.unauthorized });
        }
        const { userId , iat } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ status: false, massage: massages.auth.unauthorized });
        }
        if (user.isDeleted) {
            return res.status(401).json({ status: false, massage: massages.auth.unauthorized });
        }
        if (user.deletedAt && user.deletedAt.getTime() > iat * 1000) {
            return res.status(401).json({ status: false, massage: massages.auth.unauthorized });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ status: false, massage: error.message });
    }
}

export const authenticateGraphQL = async ({authorization }) => {

    if (!authorization) {
        throw new Error(massages.auth.tokenRequired, { statusCode: 401 });
    }
    if (!authorization.startsWith("Bearer ")) {
        throw new Error(massages.auth.invalidBearer, { statusCode: 401 });
    }
    const [bearer, token] = authorization.split(" ");
    if (!token) {
        throw new Error(massages.auth.unauthorized, { statusCode: 401 });
    }
    const { userId , iat } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    if (!user) {
        throw new Error(massages.auth.unauthorized, { statusCode: 401 });
    }
    if (user.isDeleted) {
        throw new Error(massages.auth.unauthorized, { statusCode: 401 });
    }
    if (user.deletedAt && user.deletedAt.getTime() > iat * 1000) {
        throw new Error(massages.auth.unauthorized, { statusCode: 401 });
    }

    return user;
}


export const authenticateSocket = async ({socket}) => {
    try {
        const { authorization } = socket.handshake.headers;
        if (!authorization) {
            return { status: false, massage: massages.auth.tokenRequired, statusCode: 401 };
        }
        if (!authorization.startsWith("Bearer ")) {
            return { status: false, massage: massages.auth.invalidBearer, statusCode: 401 };
        }
        const [bearer, token] = authorization.split(" ");
        if (!token) {
            return { status: false, massage: massages.auth.unauthorized, statusCode: 401 };
        }
        const { userId , iat } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(userId);

        if (!user) {
            return { status: false, massage: massages.auth.unauthorized, statusCode: 401 };
        }
        if (user.isDeleted) {
            return { status: false, massage: massages.auth.unauthorized, statusCode: 401 };
        }
        if (user.deletedAt && user.deletedAt.getTime() > iat * 1000) {
            return { status: false, massage: massages.auth.unauthorized, statusCode: 401 };
        }

        return { status: true, user , statusCode: 200 };
    } catch (error) {
        return { status: false, massage: error.message, statusCode: 500 };
    }
}