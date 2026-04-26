const express = require("express");
const router = express.Router();
const authController = require("../controllers/userController");

// middlewares 

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { uploadSingle } = require("../middleware/multer");


router.put("/update/:id", authMiddleware, authController.updateUser);
router.get("/profile", authMiddleware, authController.getUserProfile); // self tokrn se id leker 
router.get("/profile/:id", authMiddleware, authController.getUserProfile);  // admin / other

router.post("/upload-profile-pic", authMiddleware, uploadSingle, authController.uploadProfilePic);  // profile update krne ke lie 
router.post("/upload-cover-pic", authMiddleware, uploadSingle, authController.uploadCoverPic);  // Cover update krne ke lie 


module.exports = router;