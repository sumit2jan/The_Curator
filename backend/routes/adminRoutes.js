const express = require("express");
const router = express.Router();


const adminController = require("../controllers/userController");

// middlewares 
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.get("/dashboard", authMiddleware, isAdmin, adminController.getAllUsers);
router.put("/user/update/:id", authMiddleware, isAdmin, adminController.updateUser);
router.delete("/user/delete/:id", authMiddleware, isAdmin, adminController.deleteUser);
router.patch("/user/toggleVerify/:id", authMiddleware, isAdmin, adminController.toggleVerify);

module.exports = router;