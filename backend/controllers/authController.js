const User = require("../models/userModel");
const UserDetail = require("../models/userDetail");
const UserVerification = require("../models/userVerificationModel");

const { sendOTPEmail, sendWelcomeEmail, sendResetPasswordEmail, sendPasswordChangedEmail } = require("../utils/emailService");
const generateOTP = require("../utils/otp");
const { hashData, compareData } = require("../utils/hash");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccesToken } = require("../utils/jwt");

const passport = require("passport");
// send otp to user 
// const sendSignupOTP = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         //  Validate input
//         if (!username || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required",
//                 data: null,
//                 error: null,
//             });
//         }


//         // Check if username already exists
//         const existingUsername =
//             await User.findOne({ username }) ||
//             await UserVerification.findOne({ username });

//         if (existingUsername) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Username already taken",
//                 data: null,
//                 error: null,
//             });
//         }

//         //Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists",
//                 data: null,
//                 error: null,
//             });
//         }

//         // Check existing verification record
//         const existingVerification = await UserVerification.findOne({ email });

//         // Too many attempts lock
//         if (existingVerification && existingVerification.otp.attempts >= 5) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Too many failed attempts. Try again later.",
//                 data: null,
//                 error: null,
//             });
//         }

//         // Cooldown (60 sec)
//         if (
//             existingVerification &&
//             existingVerification.otp.type === "email_verification" &&
//             Date.now() - new Date(existingVerification.updatedAt).getTime() < 60 * 1000
//         ) {
//             return res.status(429).json({
//                 success: false,
//                 message: "Please wait 60 sec before requesting another OTP",
//                 data: null,
//                 error: null,
//             });
//         }

//         // Generate OTP
//         const otp = generateOTP();
//         const hashedOtp = await hashData(otp);
//         const hashedPassword = await hashData(password);

//         const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//         // Send email FIRST
//         const isEmailSent = await sendOTPEmail(email, otp);

//         if (!isEmailSent) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to send OTP email",
//                 data: null,
//                 error: null,
//             });
//         }

//         //Save / Update verification record
//         await UserVerification.findOneAndUpdate(
//             { email },
//             {
//                 username,
//                 email,
//                 password: hashedPassword,
//                 otp: {
//                     code: hashedOtp,
//                     type: "email_verification",
//                     expiresAt,
//                     attempts: 0,
//                 }
//             },
//             {
//                 upsert: true,
//                 new: true,
//             }
//         );

//         // SUCCESS
//         return res.status(200).json({
//             success: true,
//             message: "OTP sent successfully",
//             data: null,
//             error: null,
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//             data: null,
//             error: error.message,
//         });
//     }
// };

const sendSignupOTP = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null,
                error: null,
            });
        }

        // Check if username already exists ONLY in the main User collection
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already taken",
                data: null,
                error: null,
            });
        }

        // Check if user already exists in the main User collection
        const existingUser = await User.findOne({ email });

        // if user is from the google Oauth 
        if (existingUser) {

            // Account created using Google OAuth
            if (existingUser.authProvider === "google") {
                return res.status(400).json({
                    success: false,
                    message: "Please login using Continue with Google",
                    data: null,
                    error: null,
                });
            }

            // Local account already exists
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

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

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

        // Save / Update verification record
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

// Resend otp to user
const resendSignupOTP = async (req, res) => {
    try {
        const { email } = req.body;

        //Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                data: null,
                error: null,
            });
        }

        //Check verification record exists
        const existingVerification = await UserVerification.findOne({ email });

        if (!existingVerification) {
            return res.status(404).json({
                success: false,
                message: "No verification request found. Please signup again.",
                data: null,
                error: null,
            });
        }

        //Check if already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
                data: null,
                error: null,
            });
        }

        //Too many attempts lock
        if (existingVerification.otp.attempts >= 5) {
            return res.status(403).json({
                success: false,
                message: "Too many failed attempts. Try again later.",
                data: null,
                error: null,
            });
        }

        //Cooldown check (60 sec)
        if (
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

        //Generate new OTP
        const otp = generateOTP();
        const hashedOtp = await hashData(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

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

        // Update ONLY OTP (important)
        await UserVerification.findOneAndUpdate(
            { email },
            {
                otp: {
                    code: hashedOtp,
                    type: "email_verification",
                    expiresAt,
                    attempts: existingVerification.otp.attempts, // don't reset blindly
                }
            },
            {
                new: true,
            }
        );

        //SUCCESS
        return res.status(200).json({
            success: true,
            message: "OTP resent successfully",
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
        const existingUser = await User.findOne({
            $or: [
                { email: verification.email },
                { username: verification.username }
            ]
        });

        if (existingUser) {
            // Agar email match kiya
            if (existingUser.email === verification.email) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                    data: null,
                    error: null,
                });
            }
            // Agar username kisi aur ne le liya OTP verify hone ki wait karte time
            if (existingUser.username === verification.username) {
                return res.status(400).json({
                    success: false,
                    message: "Username was just taken by someone else. Please signup again with a new username.",
                    data: null,
                    error: null,
                });
            }
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

        // create userDetailModel after creating the user

        const userDetail = await UserDetail.create({
            userId: user._id
        });

        if (!userDetail) {
            return res.status(500).json({
                success: false,
                message: "Userdetail creation failed",
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
        console.log(req)
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

        if (user.authProvider === "google") {
            return res.status(400).json({
                success: false,
                message: "Please login with Using Continue With Google",
                data: null,
                error: null,
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



        // Generate token
        const token = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const deviceInfo = req.headers["user-agent"] || "Unknown Device";
        const ipAddress = req.ip;

        await User.findByIdAndUpdate(user._id, {
            $pull: { refreshTokens: { deviceInfo: deviceInfo } },
        });

        await user.addRefreshToken(refreshToken, deviceInfo, ipAddress);
        console.log(token, refreshToken)
        // Success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                refreshToken,
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

//used to refresh the refreshtoken and token 
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                data: false,
                message: "Invalid Token",
            });
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch (error) {
            console.error("error in refreh token", error.message);
            return res.status(401).json({
                success: false,
                data: false,
                message: "Refresh token expired or invalid. Please login again.",
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                data: false,
                message: "User no longer exists",
            });
        }
        if (!user.hasRefreshToken(refreshToken)) {
            return res.status(401).json({
                success: false,
                data: false,
                message: "Session revoked. Please login again.",
            });
        }

        // exports.refresh update
        const deviceInfo = req.headers["user-agent"] || "Unknown Device";
        const ipAddress = req.ip;

        // CHANGE THIS: Instead of just user.removeRefreshToken(refreshToken)
        // Use an atomic update to wipe the device sessions and add the new one
        await User.findByIdAndUpdate(user._id, {
            $pull: { refreshTokens: { deviceInfo: deviceInfo } },
        });

        const newRefreshToken = generateRefreshToken(user);
        const newToken = generateAccessToken(user);

        // Add the rotated token
        await user.addRefreshToken(newRefreshToken, deviceInfo, ipAddress);
        // 5. Send both back
        res.status(200).json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
            },
            message: "Token refreshed",
        });
    } catch (error) {
        console.error("refresh token Error: ", error.message);

        return res.status(500).json({
            success: false,
            data: false,
            message: "Could not refresh token",
        });
    }
};

// Step 1 — redirect to Google
const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
});

// Step 2 — Google redirects back here
const googleCallback = (req, res, next) => {
    console.log("google callback hit");

    passport.authenticate(
        "google",
        {
            session: false,
            failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
        },
        async (error, user) => {
            try {
                if (error || !user) {
                    console.log("No user or error:", error);

                    return res.send(`
            <script>
              window.opener.postMessage(
                { error: "google_failed" },
                "${process.env.CLIENT_URL}"
              );
              window.close();
            </script>
          `);
                }

                console.log("user found:", user._id);

                // 🔐 Generate tokens
                const token = generateAccessToken(user); // keep name consistent
                const refreshToken = generateRefreshToken(user);

                console.log("tokens generated");

                const deviceInfo = req.headers["user-agent"] || "Unknown Device";
                const ipAddress = req.ip;

                // 🧹 Remove existing session for same device
                await User.findByIdAndUpdate(user._id, {
                    $pull: { refreshTokens: { deviceInfo: deviceInfo } },
                });

                // Save new refresh token
                await user.addRefreshToken(refreshToken, deviceInfo, ipAddress);

                console.log("refresh token saved");

                // SAFER RESPONSE (no string injection issues)
                const payload = {
                    user,
                    token,
                    refreshToken,
                };

                console.log(payload)

                res.send(`
          <script>
           console.log(window.opener);
            window.opener.postMessage(
              ${JSON.stringify(payload)},
              "${process.env.CLIENT_URL}"
            );
            window.close();
          </script>
        `);

            } catch (err) {
                console.error("Google Callback Error:", err.message);

                res.redirect(
                    `${process.env.CLIENT_URL}/login?error=server_error`
                );
            }
        }
    )(req, res, next);
};

// const googleCallback = (req, res, next) => {
//     passport.authenticate(
//         "google",
//         {
//             session: false,
//             failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
//         },
//         async (error, user) => {
//             try {
//                 if (error || !user) {
//                     console.log("No user or error:", error);
//                     return res.send(`
//   <script>
//     window.opener.postMessage({ error: "google_failed" }, "${process.env.CLIENT_URL}");
//     window.close();
//   </script>
// `);
//                 }
//                 console.log("user found:", user._id);

//                 const accessToken = generateAccessToken(user);
//                 console.log("accessToken generated");

//                 const refreshToken = generateRefreshToken(user);
//                 console.log("refreshToken generated");

//                 const deviceInfo = req.headers["user-agent"] || "Unknown Device";
//                 const ipAddress = req.ip;

//                 // Clear any existing Google or Local sessions for this device
//                 await User.findByIdAndUpdate(user._id, {
//                     $pull: { refreshTokens: { deviceInfo: deviceInfo } },
//                 });

//                 await user.addRefreshToken(refreshToken, deviceInfo, ipAddress);
//                 console.log("refresh token saved");

//                 /* // Redirect to frontend with both tokens in query params
//                 res.redirect(
//                   `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
//                 ); */

//                 res.send(`
//   <script>
//     window.opener.postMessage(
//       { accessToken: "${accessToken}", refreshToken: "${refreshToken}" },
//       "${process.env.CLIENT_URL}"
//     );
//     window.close();
//   </script>
// `);
//             } catch (error) {
//                 console.error("Wavelog Google Callback Error:", error.message);
//                 res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
//             }
//         },
//     )(req, res, next);
// };

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

// for Unverified Users (During Login)
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

// Resend OTP for Unverified Users (During Login)
const resendVerifyOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                data: null,
                error: null,
            });
        }

        // 1. Check if user exists in main DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please signup first.",
                data: null,
                error: null,
            });
        }

        // 2. Check if already verified (Faltu mein OTP kyu bhejna)
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Account is already verified. Please login.",
                data: null,
                error: null,
            });
        }

        // 3. Check existing verification record
        const existingVerification = await UserVerification.findOne({
            userId: user._id,
            "otp.type": "reverification"
        });

        // 4. Cooldown and Attempts check
        let currentAttempts = 0;

        if (existingVerification) {
            if (existingVerification.otp.attempts >= 5) {
                return res.status(403).json({
                    success: false,
                    message: "Too many failed attempts. Try again later.",
                    data: null,
                    error: null,
                });
            }

            if (Date.now() - new Date(existingVerification.updatedAt).getTime() < 60 * 1000) {
                return res.status(429).json({
                    success: false,
                    message: "Please wait 60 sec before requesting another OTP",
                    data: null,
                    error: null,
                });
            }

            currentAttempts = existingVerification.otp.attempts;
        }

        // 5. Generate new OTP
        const otp = generateOTP();
        const hashedOtp = await hashData(otp);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // 6. Send email FIRST
        const isEmailSent = await sendOTPEmail(email, otp);

        if (!isEmailSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email",
                data: null,
                error: null,
            });
        }

        // 7. Upsert (Update or Create) Verification Record
        await UserVerification.findOneAndUpdate(
            { userId: user._id },
            {
                email: user.email,
                userId: user._id,
                otp: {
                    code: hashedOtp,
                    type: "reverification",
                    expiresAt,
                    attempts: currentAttempts, // Purane attempts maintain rakho
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
            message: "OTP resent successfully",
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


module.exports = {
    sendSignupOTP,
    resendSignupOTP,
    verifyOTPAndRegister,
    login,
    sendResetOTP,
    resetPassword,
    changePassword,
    verifyOTP,
    resendVerifyOTP,
    refresh,
    googleAuth,
    googleCallback,
};