const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            return next(new Error(error.message, { cause: 500 }));
        }
    }
}

export default asyncHandler;