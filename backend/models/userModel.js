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
      minlength: 8,
      maxlength: 128,
      select: false,
      required: function () {
        return this.authProvider === "local"; 
      }
    },

    isVerified: {
      type: Boolean,
      default: false, // after OTP verification user create ho raha hai
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        deviceInfo: { type: String, default: "Unknown Device" },
        ipAddress: { type: String, default: null },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 60 * 60 * 24 * 30,
        },
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

  },
  { timestamps: true }
);

UserSchema.methods.addRefreshToken = function (token, deviceInfo, ipAddress) {
  if (this.refreshTokens.length >= 5) {
    this.refreshTokens.shift(); // evict oldest if over device limit
  }
  this.refreshTokens.push({ token, deviceInfo, ipAddress });
  return this.save();
};

UserSchema.methods.removeAllRefreshTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

UserSchema.methods.hasRefreshToken = function (token) {
  return this.refreshTokens.some((t) => t.token === token);
};

UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshTokens; // never expose sessions
    delete ret.googleId;
  },
});



module.exports = mongoose.model("User", UserSchema);