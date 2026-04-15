const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // ✅ important
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    otp: {
      code: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "email_verification",
          "password_reset",
          "account_deletion",
          "subscription_confirm",
        ],
        default: "email_verification",
      },

      expiresAt: {
        type: Date,
        required: true,
      },

      attempts: {
        type: Number,
        default: 0,
        max: 5,
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // ⏱ auto delete after 5 min
    },
  },
  { timestamps: true }
);

// TTL based on expiresAt (extra safety)
userVerificationSchema.index(
  { "otp.expiresAt": 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "UserVerification",
  userVerificationSchema
);