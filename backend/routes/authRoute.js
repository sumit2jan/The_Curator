const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup/send-otp", authController.sendSignupOTP);
router.post("/signup/Resend-otp", authController.resendSignupOTP);
router.post("/signup/verify-create", authController.verifyOTPAndRegister);



router.post("/refresh", authController.refresh);

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);



router.post("/login", authController.login);
router.post("/verifyUser", authController.verifyOTP);
router.post("/resendVerifyOTP", authController.resendVerifyOTP);

router.post("/password/send-otp", authController.sendResetOTP);
router.post("/password/reset", authController.resetPassword);
router.post("/password/change", authMiddleware, authController.changePassword);

module.exports = router;