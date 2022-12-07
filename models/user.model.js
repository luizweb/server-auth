import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm,
    },
    passwordHash: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    }
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);

export default userModel;
