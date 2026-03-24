export const isAuthoraized = (...role) => {
    return (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new Error("unauthorized", { cause: 401 }));
        }
        return next();
    }
}