import jwt from "jsonwebtoken";
export const genrateTokens = (
    {
        payload
        , secret = process.env.JWT_SECRET
        , options = {}
    }
) => {
    const token = jwt.sign(payload, secret, options);
    return token;
}