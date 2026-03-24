import bcrypt from "bcryptjs"
export const hash = ({ password, saltRound = 8 }) => {
    return bcrypt.hashSync(password, saltRound);
}