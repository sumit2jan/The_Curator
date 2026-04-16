const User = require("../models/userModel");
const UserVerification = require("../models/userVerificationModel");

const { sendOTPEmail, sendWelcomeEmail, sendResetPasswordEmail, sendPasswordChangedEmail } = require("../utils/emailService");
const generateOTP = require("../utils/otp");
const { hashData, compareData } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

// send otp to user 
const sendSignupOTP = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //  Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null,
                error: null,
            });
        }


        // Check if username already exists
        const existingUsername =
            await User.findOne({ username }) ||
            await UserVerification.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already taken",
                data: null,
                error: null,
            });
        }

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: null,
                error: null,
            });
        }

        // Check existing verification record
        const existingVerification = await UserVerification.findOne({ email });

        // Too many attempts lock
        if (existingVerification && existingVerification.otp.attempts >= 5) {
            return res.status(403).json({
                success: false,
                message: "Too many failed attempts. Try again later.",
                data: null,
                error: null,
            });
        }

        // Cooldown (60 sec)
        if (
            existingVerification &&
            existingVerification.otp.type === "email_verification" &&
            Date.now() - new Date(existingVerification.updatedAt).getTime() < 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait 60 sec before requesting another OTP",
                data: null,
                error: null,
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const hashedOtp = await hashData(otp);
        const hashedPassword = await hashData(password);

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        // Send email FIRST
        const isEmailSent = await sendOTPEmail(email, otp);

        if (!isEmailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email",
                data: null,
                error: null,
            });
        }

        //Save / Update verification record
        await UserVerification.findOneAndUpdate(
            { email },
            {
                username,
                email,
                password: hashedPassword,
                otp: {
                    code: hashedOtp,
                    type: "email_verification",
                    expiresAt,
                    attempts: 0,
                }
            },
            {
                upsert: true,
                new: true,
            }
        );

        // SUCCESS
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: null,
            error: null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: null,
            error: error.message,
        });
    }
};

// verify and create user
const verifyOTPAndRegister = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
                data: null,
                error: null,
            });
        }

        // Find verification record
        const verification = await UserVerification.findOne({ email });

        if (!verification) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null,
                error: null,
            });
        }

        if (verification.otp.type !== "email_verification") {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null,
                error: null,
            });
        }

        // Expiry check
        if (verification.otp.expiresAt < new Date()) {
            await UserVerification.deleteOne({ email });

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new one.",
                data: null,
                error: null,
            });
        }

        // Attempt limit
        if (verification.otp.attempts >= 5) {
            return res.status(403).json({
                success: false,
                message: "Too many attempts. Please request a new OTP.",
                data: null,
                error: null,
            });
        }

        // Compare OTP
        const isMatch = await compareData(otp, verification.otp.code);

        if (!isMatch) {
            verification.otp.attempts += 1;
            await verification.save();

            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null,
                error: null,
            });
        }

        // checking email is already exists in signup or not
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: null,
                error: null,
            });
        }
        // Create user
        const user = await User.create({
            username: verification.username,
            email: verification.email,
            password: verification.password,
            isVerified: true,
        });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User creation failed",
                data: null,
                error: null,
            });
        }

        // Delete verification record
        await UserVerification.deleteOne({ email });

        // Send welcome/congratulations email 🎉
        try {
            await sendWelcomeEmail(user.email, user.username);
        } catch (err) {
            console.log("Welcome email failed:", err.message);
        }

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            error: null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            data: null,
            error: error.message,
        });
    }
};

//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //  Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null,
                error: null,
            });
        }

        //  Find user (+password)
        const user = await User.findOne({ email }).select("+password");

        //  Check user exists
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null,
                error: null,
            });
        }

        // Check verified
        if (!user.isVerified) {

            // cooldown feature 
            const existing = await UserVerification.findOne({
                userId: user._id,
                "otp.type": "reverification"
            });

            if (
                existing &&
                Date.now() - new Date(existing.updatedAt).getTime() < 60 * 1000
            ) {
                return res.status(429).json({
                    success: false,
                    message: "Please wait before requesting another OTP",
                    data: null,
                    error: null
                });
            }
            await UserVerification.deleteMany({
                userId: user._id,
                "otp.type": "reverification"
            });

            // generate OTP
            const otp = generateOTP();

            const hashedOtp = await hashData(otp);
            // save OTP
            await UserVerification.create({
                userId: user._id,
                otp: {
                    code: hashedOtp,
                    type: "reverification",
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                }
            });

            // EMAIL SEND 
            await sendOTPEmail(user.email, otp);

            return res.status(403).json({
                success: false,
                message: "Account not verified. OTP sent to your email",
                data: null,
                error: null
            });
        }

        // Compare password
        const isMatch = await compareData(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null,
                error: null,
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            error: null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            data: null,
            error: error.message,
        });
    }
};

// forgot otp send 
const sendResetOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Validate
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                data: null,
                error: null,
            });
        }

        // 2. Find user (don't reveal existence)
        const user = await User.findOne({ email });

        // If user exists → work with userId
        let existing = null;

        if (user) {
            existing = await UserVerification.findOne({
                userId: user._id,
                "otp.type": "password_reset"
            });
        }

        // 3. Cooldown + attempts check
        if (existing) {

            if (existing.otp.attempts >= 5) {
                return res.status(403).json({
                    success: false,
                    message: "Too many attempts. Try again later.",
                    data: null,
                    error: null,
                });
            }

            if (Date.now() - new Date(existing.updatedAt).getTime() < 60 * 1000) {
                return res.status(429).json({
                    success: false,
                    message: "Please wait before requesting another OTP",
                    data: null,
                    error: null,
                });
            }
        }

        // 4. Generate OTP
        const otp = generateOTP();
        const hashedOtp = await hashData(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // 5. If user exists → send + save
        if (user) {

            // send email
            await sendResetPasswordEmail(user.email, otp);

            // delete old OTP (clean)
            await UserVerification.deleteMany({
                userId: user._id,
                "otp.type": "password_reset"
            });

            // save new OTP
            await UserVerification.create({
                userId: user._id,
                otp: {
                    code: hashedOtp,
                    type: "password_reset",
                    expiresAt,
                    attempts: 0,
                },
            });
        }

        // 6. Always same response (security)
        return res.status(200).json({
            success: true,
            message: "If an account exists, check your email for the OTP.",
            data: null,
            error: null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send reset OTP",
            data: null,
            error: error.message,
        });
    }
};

// setting the new password after receving the otp
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // 1. Validate
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required",
                data: null,
                error: null,
            });
        }

        // 2. Find user first (IMPORTANT 🔥)
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: null,
                error: null,
            });
        }

        // 3. Find verification using userId (FIXED 🔥)
        const verification = await UserVerification.findOne({
            userId: user._id,
            "otp.type": "password_reset"
        });

        if (!verification) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null,
                error: null,
            });
        }

        // 4. Expiry check
        if (verification.otp.expiresAt < new Date()) {
            await UserVerification.deleteMany({ userId: user._id });

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new one.",
                data: null,
                error: null,
            });
        }

        // 5. Attempt limit
        if (verification.otp.attempts >= 5) {
            return res.status(403).json({
                success: false,
                message: "Too many attempts. Please request a new OTP.",
                data: null,
                error: null,
            });
        }

        // 6. Compare OTP
        const isMatch = await compareData(otp, verification.otp.code);

        if (!isMatch) {
            verification.otp.attempts += 1;
            await verification.save();

            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null,
                error: null,
            });
        }

        // 7. Prevent same password reuse
        const isSame = await compareData(newPassword, user.password);

        if (isSame) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password",
                data: null,
                error: null,
            });
        }

        // 8. Hash new password
        const hashedPassword = await hashData(newPassword);
        user.password = hashedPassword;
        await user.save();

        // 9. Send confirmation email (optional)
        try {
            await sendPasswordChangedEmail(user.email, user.username);
        } catch (err) {
            console.log("Password changed email failed:", err.message);
        }

        // 10. Delete OTP
        await UserVerification.deleteMany({
            userId: user._id,
            "otp.type": "password_reset"
        });

        // 11. Success
        return res.status(200).json({
            success: true,
            message: "Password reset successful",
            data: null,
            error: null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Password reset failed",
            data: null,
            error: error.message,
        });
    }
};

// change password after login
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required",
                data: null,
                error: null,
            });
        }

        // Get logged-in user (middleware se)
        const user = await User.findById(req.user._id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
                error: null,
            });
        }

        // Check old password
        const isMatch = await compareData(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
                data: null,
                error: null,
            });
        }

        // Prevent same password reuse
        const isSame = await compareData(newPassword, user.password);

        if (isSame) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password",
                data: null,
                error: null,
            });
        }

        // Hash new password
        const hashedPassword = await hashData(newPassword);

        user.password = hashedPassword;
        await user.save();

        // Success
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: null,
            error: null,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to change password",
            data: null,
            error: error.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Validate
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
                data: null,
                error: null,
            });
        }

        // 2. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: null,
                error: null,
            });
        }

        // 3. Find OTP (userId based)
        const verification = await UserVerification.findOne({
            userId: user._id,
            "otp.type": "reverification"
        });

        if (!verification) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
                data: null,
                error: null,
            });
        }

        // 4. Expiry check
        if (verification.otp.expiresAt < new Date()) {
            await UserVerification.deleteMany({
                userId: user._id,
                "otp.type": "reverification"
            });

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new one.",
                data: null,
                error: null,
            });
        }

        // 5. Attempt limit
        if (verification.otp.attempts >= 5) {
            return res.status(403).json({
                success: false,
                message: "Too many attempts. Please request a new OTP.",
                data: null,
                error: null,
            });
        }

        // 6. Compare OTP (IMPORTANT: hashed compare)
        const isMatch = await compareData(otp, verification.otp.code);

        if (!isMatch) {
            verification.otp.attempts += 1;
            await verification.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                data: null,
                error: null,
            });
        }

        // 7. Mark user verified
        user.isVerified = true;
        await user.save();

        // 8. Delete OTP
        await UserVerification.deleteMany({
            userId: user._id,
            "otp.type": "reverification"
        });

        // 9. Success
        return res.status(200).json({
            success: true,
            message: "Account verified successfully",
            data: null,
            error: null,
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            data: null,
            error: error.message,
        });
    }
};


module.exports = {
    sendSignupOTP,
    verifyOTPAndRegister,
    login,
    sendResetOTP,
    resetPassword,
    changePassword,
    verifyOTP
};