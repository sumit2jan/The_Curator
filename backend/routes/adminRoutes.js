const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const adminController = require("../controllers/userController");
const blogController = require("../controllers/blogController");

// middlewares 
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { uploadSingle } = require("../middleware/multer"); // for single file upload
const { uploadMultiple } = require("../middleware/multer"); // for double file upload


//  CRUD user routes
router.get("/dashboard", authMiddleware, isAdmin, adminController.getAllUsers);
router.put("/user/update/:id", authMiddleware, isAdmin, adminController.updateUser);
router.delete("/user/delete/:id", authMiddleware, isAdmin, adminController.deleteUser);
router.get("/profile/:id", authMiddleware, isAdmin, userController.getUserProfile); // to get profile 
router.patch("/user/toggleVerify/:id", authMiddleware, isAdmin, adminController.toggleVerify);

// CRUD blog Category routes
router.post("/category", authMiddleware, isAdmin, blogController.createCategory);
router.get("/categories", blogController.getAllCategories);
router.put("/update-category/:id", authMiddleware, isAdmin, blogController.updateCategory);
router.delete("/soft-delete-category/:id", authMiddleware, isAdmin, blogController.deleteCategory);
router.patch("/restor-category/:id", authMiddleware, isAdmin, blogController.restoreCategory);
router.delete("/permanent-delete-category/:id", authMiddleware, isAdmin, blogController.permanentlyDeleteCategory);


// blog crud routes 

router.put("/update-blog", authMiddleware, isAdmin, blogController.updateBlog); // for updating the blog 
router.put("/soft-delete-blog", authMiddleware, isAdmin, blogController.softDeleteBlog);// for soft delete
router.put("/delete-blog", authMiddleware, isAdmin, blogController.permanentlyDeleteBlog);// for permanent delete

module.exports = router;