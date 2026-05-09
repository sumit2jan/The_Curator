const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const blogController = require("../controllers/blogController");



// middlewares 
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const { uploadSingle } = require("../middleware/multer"); // for single file upload
const { uploadMultiple } = require("../middleware/multer"); // for multiple file upload

// to get all categories 
router.get("/blog-categories", blogController.getAllCategories); // isme auth wala add krdu ga aage chl ke !!!!!!!!!!!!!! yaad se krna hai yeh maine baad mai

// upload image and vedio in the vlog.
router.post("/upload-blog-media", authMiddleware, uploadMultiple, blogController.uploadBlogMedia);
router.post("/upload-blog-cover", authMiddleware, uploadSingle, blogController.uploadBlogCover);

// blog create api
router.post("/create-blog", authMiddleware, blogController.createBlog);
// blog update api 
router.put("/update-blog/:id", authMiddleware, blogController.updateBlog);

//soft delete 
router.delete("/soft-delete-blog/:id", authMiddleware, blogController.softDeleteBlog);

// hard delete 
router.delete("/delete-blog/:id", authMiddleware, blogController.permanentlyDeleteBlog);

// get blog by id 
router.get("/get-blogid/:id", authMiddleware, blogController.getBlogById); // yha se saari abhi admin mai bhi add krni hai mujhe

// get blog by slug 
router.get("/get-blogslug/:slug", authMiddleware, blogController.getBlogBySlug);

// get all blog 
router.get("/blogs", authMiddleware, blogController.getAllBlogs);

// get all users blog 
router.get("/:userId", authMiddleware, blogController.getUserBlogs);

// get featured blog 
router.get("/featured", authMiddleware, blogController.getFeaturedBlogs);

// like a blog or unlike 

router.post("/:blogId/like", authMiddleware, blogController.toggleLike)
module.exports = router;





