const mongoose = require("mongoose");

const userVerificationSchema = new mongoose.Schema(
  {
    // Existing user flows (login / forgot / reverification)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return (
          this.otp &&
          (this.otp.type === "reverification" ||
            this.otp.type === "password_reset")
        );
      },
    },

    // Signup flow only
    username: {
      type: String,
      trim: true,
      required: function () {
        return this.otp && this.otp.type === "email_verification";
      },
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: function () {
        return this.otp && this.otp.type === "email_verification";
      },
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please use a valid email address",
      ],
    },

    password: {
      type: String,
      minlength: 6,
      required: function () {
        return this.otp && this.otp.type === "email_verification";
      },
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
          "reverification",
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
      expires: 300, // auto delete after 5 min
    },
  },
  { timestamps: true }
);

// Indexes (performance boost)
userVerificationSchema.index({ userId: 1 });
userVerificationSchema.index({ "otp.type": 1 });

// TTL index (extra safety)
userVerificationSchema.index(
  { "otp.expiresAt": 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("UserVerification", userVerificationSchema);