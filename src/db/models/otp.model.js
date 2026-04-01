import { model, Schema } from "mongoose";


const otpSchema = new Schema({
    email: { type: String, required: true },
    otp:   { type: String, required: true },
    type:  { type: String, enum: ["confirmEmail", "forgetPassword", "updateEmail"], required: true }
},
    {
        timestamps: true,
        versionKey: false
    }
)


const OTP = model("OTP", otpSchema);
export default OTP;