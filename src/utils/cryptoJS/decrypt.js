import CryptoJS from "crypto-js";

export const Decrypt = ({ data, key = process.env.CryptoJSKey }) => {
    return CryptoJS.AES.decrypt(
        data,
        key,
    ).toString(CryptoJS.enc.Utf8)
}