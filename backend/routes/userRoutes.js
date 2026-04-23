const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");

// middlewares 

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");


router.put("/update/:id", authMiddleware, authController.updateUser);
router.get("/profile", authMiddleware, authController.getUserProfile);      // self
router.get("/profile/:id", authMiddleware, authController.getUserProfile);  // admin / other

module.exports = router;