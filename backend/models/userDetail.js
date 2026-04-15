const mongoose = require("mongoose");
const userDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
            unique: true,
        },

        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [30, "First name cannot exceed 30 characters"],
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [30, "Last name cannot exceed 30 characters"],
        },

        gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: {
                values: ["Male", "Female", "Other"],
                message: "Gender must be Male, Female, or Other",
            },
        },

        country: {
            type: String,
            required: [true, "Country is required"],
            trim: true,
            minlength: [2, "Country name too short"]
        },

        bio: {
            type: String,
            required: [true, "Bio is required"],
            maxlength: [500, "Bio cannot exceed 500 characters"]
        },

        dob: {
            type: Date,
            required: [true, "Date of Birth is required"],
        },
        profilePic: {
            type: String,
            default: "/uploads/default.png"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserDetail", userDetailSchema);
