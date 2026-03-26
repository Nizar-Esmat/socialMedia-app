export const globalError = (err, req, res, next) => {
    if(process.env.MODE== "dev"){
        return res.status(err.cause || 500).json({ status: false, massage: err.message, stack: err.stack });
    }
    return res.status(err.cause || 500).json({ status: false, massage: err.message });
}