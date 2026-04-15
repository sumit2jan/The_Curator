const express = require("express");
const router = express.Router();


const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.get("/admin/dashboard", authMiddleware, isAdmin, adminController.getAllUsers);

module.exports = router;