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

        // 1. Validate
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                data: null,
                error: null,
            });
        }

        // 2. Find user (+password)
        const user = await User.findOne({ email }).select("+password");

        // 3. Check user exists
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null,
                error: null,
            });
        }

        // 4. Check verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your account first",
                data: null,
                error: null,
            });
        }

        // 5. Compare password
        const isMatch = await compareData(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                data: null,
                error: null,
            });
        }

        // 6. Generate token
        const token = generateToken(user._id);

        // 7. Success response
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

        // Validate
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                data: null,
                error: null,
            });
        }

        // Check user exists (but don't reveal)
        const user = await User.findOne({ email });

        // Cooldown + attempts check
        const existing = await UserVerification.findOne({ email });

        if (existing && existing.otp.type === "password_reset") {

            // too many attempts
            if (existing.otp.attempts >= 5) {
                return res.status(403).json({
                    success: false,
                    message: "Too many attempts. Try again later.",
                    data: null,
                    error: null,
                });
            }

            // cooldown
            if (Date.now() - new Date(existing.updatedAt).getTime() < 60 * 1000) {
                return res.status(429).json({
                    success: false,
                    message: "Please wait before requesting another OTP",
                    data: null,
                    error: null,
                });
            }
        }

        // Generate OTP
        const otp = generateOTP();
        const hashedOtp = await hashData(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Send email (only if user exists)
        if (user) {
            await sendResetPasswordEmail(email, otp);
        }

        // Save OTP (only if user exists)
        if (user) {
            await UserVerification.findOneAndUpdate(
                { email },
                {
                    email,
                    otp: {
                        code: hashedOtp,
                        type: "password_reset",
                        expiresAt,
                        attempts: 0,
                    },
                },
                { upsert: true, new: true }
            );
        }

        // Always send same response (security)
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

        // Validate
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required",
                data: null,
                error: null,
            });
        }

        // Find verification record
        const verification = await UserVerification.findOne({ email });

        if (!verification || verification.otp.type !== "password_reset") {
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

        // Find user
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
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

        //Hash new password
        const hashedPassword = await hashData(newPassword);

        user.password = hashedPassword;
        await user.save();


        //email fail ho → ignore

        try {
            await sendPasswordChangedEmail(user.email, user.username);
        } catch (err) {
            console.log("Password changed email failed:", err.message);
        }

        // Delete OTP record
        await UserVerification.deleteOne({ email });

        //  Success
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


module.exports = {
    sendSignupOTP,
    verifyOTPAndRegister,
    login,
    sendResetOTP,
    resetPassword,
    changePassword
};