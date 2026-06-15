import mongoose, { model, models } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "org", "admin"], default: "user" },
    verified: { type: Boolean, default: false },
    orgName: { type: String, default: "" },
    orgType: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 280 },
    website: { type: String, default: "" },
    country: { type: String, default: "" },
    mustChangePassword: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = models.User ?? model("User", UserSchema);
