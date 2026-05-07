const express = require("express");
const router = express.Router();

// Import all routes
const authRoutes = require("./authRoute");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const blogRoutes = require("./blogRoutes");
const aiRoutes = require("./aiRoutes");

// Use routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/user", userRoutes);
router.use("/blog", blogRoutes);
router.use("/ai", aiRoutes);

module.exports = router;