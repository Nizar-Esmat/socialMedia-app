import EventEmitter from "events";
import { sendEmail } from "./email/sendEmail.js";
import randomstring from "randomstring";
import OTP from "../db/models/otp.model.js";
import { hash } from "./index.js";
import { emailTemplate } from "./index.js";
const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async({ email, subject, type }) => {

    const otp = randomstring.generate({
        length: 6,
        charset: "numeric",
    });

    const hashOTP = hash({password : otp});
    
    await OTP.create({ email, otp: hashOTP, type });

    sendEmail({ email, subject, html: await emailTemplate({code : otp, message: subject})}).catch((err) =>
        console.error("Failed to send email:", err)
    );
});

export default emailEmitter;
