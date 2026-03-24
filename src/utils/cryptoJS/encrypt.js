import CryptoJS from "crypto-js";
export const encrypt = ({ data, key = process.env.CryptoJSKey }) => {
    return CryptoJS.AES.encrypt(
        data,
        key,
    ).toString()
}