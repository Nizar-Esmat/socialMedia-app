import { Schema, model } from "mongoose";

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
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    userName: {
      type: String,
      required: [true, "userName is required"],
      unique: [true, "userName must be unique"],
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
      enum: {
        values: Object.values(gender),
        message: "gender must be female or male",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "phoneNumber is required"],
      unique: [true, "phoneNumber must be unique"],
    },
    role: {
      type: String,
      enum: {
        values: Object.values(role),
        message: "role must be user or admin",
      },
      default: role.USER,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = model("User", userSchema);
export default User;