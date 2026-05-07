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

// yha mai ab blog ke route add kra hu 
router.post("/upload-blog-media", authMiddleware, uploadMultiple, blogController.uploadBlogMedia);
router.post("/upload-blog-cover", authMiddleware, uploadSingle, blogController.uploadBlogCover);

// blog create api
router.post("/create-blog", authMiddleware, blogController.createBlog);
router.put("/update-blog/:id", authMiddleware, blogController.updateBlog);

router.delete("/soft-delete-blog/:id", authMiddleware, blogController.softDeleteBlog);
router.delete("/delete-blog/:id", authMiddleware, blogController.permanentlyDeleteBlog);

router.get("/get-blogid/:id", authMiddleware, blogController.getBlogById); // yha se saari abhi admin mai bhi add krni hai mujhe
router.get("/get-blogslug/:slug", authMiddleware, blogController.getBlogBySlug);

router.get("/blogs", authMiddleware, blogController.getAllBlogs);
router.get("/:userId", authMiddleware, blogController.getUserBlogs);
router.get("/featured", authMiddleware, blogController.getFeaturedBlogs);

module.exports = router;





