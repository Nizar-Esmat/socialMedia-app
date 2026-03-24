export const globalError = (err, req, res, next) => {
    return res.status(err.cause || 500).json({ status: false, massage: err.message });
}