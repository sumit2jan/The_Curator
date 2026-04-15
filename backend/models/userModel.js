const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 12,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
      select: false
    },

    profilePic: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false, // ✅ after OTP verification user create ho raha hai
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    subscribersCount: { type: Number, default: 0 },
    subscribedToCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", UserSchema);