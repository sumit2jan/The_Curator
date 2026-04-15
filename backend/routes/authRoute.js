const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/auth/signup/send-otp", authController.sendSignupOTP);
router.post("/auth/signup/verify-create", authController.verifyOTPAndRegister);
router.post("/auth/login", authController.login);
router.post("/auth/password/send-otp", authController.sendResetOTP);
router.post("/auth/password/reset", authController.resetPassword);
router.post("/auth/password/change", authMiddleware, authController.changePassword);

module.exports = router;