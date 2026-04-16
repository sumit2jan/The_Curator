const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");

// middlewares 

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");


router.put("/update/:id", authMiddleware, authController.updateUser);

module.exports = router;