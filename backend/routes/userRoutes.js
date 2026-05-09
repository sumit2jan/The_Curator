const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");


// middlewares 

const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { uploadSingle } = require("../middleware/multer"); // for single file upload
const { uploadMultiple } = require("../middleware/multer"); // for double file upload


router.put("/update/:id", authMiddleware, userController.updateUser);
router.get("/profile", authMiddleware, userController.getUserProfile); // self tokrn se id leker 
router.get("/profile/:id", authMiddleware, userController.getUserProfile);  // admin / other

router.post("/upload-profile-pic", authMiddleware, uploadSingle, userController.uploadProfilePic);  // profile update krne ke lie 
router.post("/upload-cover-pic", authMiddleware, uploadSingle, userController.uploadCoverPic);  // Cover update krne ke lie 

router.post("/:userId/follow", authMiddleware, userController.toggleFollow); // to follow and unfollow

module.exports = router; 