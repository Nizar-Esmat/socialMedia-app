import bcrypt from "bcryptjs"
export const compare = ({ password, hash }) => {
    return bcrypt.compareSync(password, hash);
}