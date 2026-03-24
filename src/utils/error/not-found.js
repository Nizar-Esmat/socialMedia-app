export const notFOund = (req, res, next) => {
    return next(new Error("route not found", { cause: 404 }));
}