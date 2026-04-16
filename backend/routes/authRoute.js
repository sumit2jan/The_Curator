const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup/send-otp", authController.sendSignupOTP);
router.post("/signup/verify-create", authController.verifyOTPAndRegister);
router.post("/login", authController.login);
router.post("/verifyUser", authController.verifyOTP);
router.post("/password/send-otp", authController.sendResetOTP);
router.post("/password/reset", authController.resetPassword);
router.post("/password/change", authMiddleware, authController.changePassword);

module.exports = router;