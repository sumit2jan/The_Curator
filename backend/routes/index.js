const express = require("express");
const router = express.Router();

// Import all routes
const authRoutes = require("./authRoute");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");

// Use routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);

module.exports = router;