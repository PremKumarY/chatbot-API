import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN"],
      default: "SUPER_ADMIN"
    },

    // 🔐 SECURITY FIELDS (IMPORTANT)
    loginAttempts: {
      type: Number,
      default: 0
    },

    lockUntil: {
      type: Date,
      default: null
    },

    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
