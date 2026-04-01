import { Schema, model } from "mongoose";
import { hash } from "../../utils/index.js";

export const gender = {
  FEMALE: "female",
  MALE: "male",
};
export const role = {
  USER: "user",
  ADMIN: "admin",
}
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ConfirmPassword: { type: String, required: true },
    userName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: Object.values(gender), default: gender.FEMALE },
    image: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    coverImages: [
      {
        secure_url: { type: String },
        public_id: { type: String },
      }
    ],

    role: { type: String, enum: Object.values(role), default: role.USER },
    isConfirmed: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    changePasswordAt: { type: Date },
    pendingEmail: { type: String },

    viwers: [{
      type: Schema.Types.ObjectId,
      ref: "User"
      , time: [Date]
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const User = model("User", userSchema);
export default User;