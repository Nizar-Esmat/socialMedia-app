import nodemailer from "nodemailer";

const transPorter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

export const sendEmail = async (options) => {
    const message = {
        from: "saraha app",
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }
    const info = await transPorter.sendMail(message);
    if (info.rejected.length > 0) {
        console.log("email did not sent");
    }
}