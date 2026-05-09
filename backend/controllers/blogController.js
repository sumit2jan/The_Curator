const Category = require("../models/blogCategoryModel");
const uploadMedia = require("../utils/uploadMedia");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// CREATE CATEGORY (Admin)
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
                data: null
            });
        }

        const existing = await Category.findOne({
            name: name.trim(),
            isDeleted: false,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
                data: null
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description,
            createdBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        console.error("Create Category Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error creating category",
            data: null
        });
    }
};

// GET ALL CATEGORIES (Public)
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isDeleted: false })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories
        });

    } catch (error) {
        console.error("Get Categories Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
            data: null
        });
    }
};

// UPDATE CATEGORY (Admin)
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, description } = req.body;

        const category = await Category.findById(categoryId);

        if (!category || category.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                data: null
            });
        }

        if (name && name.trim() !== category.name) {
            const exists = await Category.findOne({
                name: name.trim(),
                _id: { $ne: categoryId },
                isDeleted: false,
            });

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Category name already exists",
                    data: null
                });
            }

            category.name = name.trim();
        }

        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        console.error("Update Category Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error updating category",
            data: null
        });
    }
};

// DELETE CATEGORY (Soft Delete - Admin)
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);

        if (!category || category.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                data: null
            });
        }

        category.isDeleted = true;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: null
        });

    } catch (error) {
        console.error("Soft Deleted Category Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error Soft deleting category",
            data: null
        });
    }
};

// DELETE CATEGORY restore api age koi soft delete kr di hai maine toh us liye 
const restoreCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);

        if (!category || !category.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Category not found or not deleted",
                data: null
            });
        }

        category.isDeleted = false;
        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category restored successfully",
            data: category
        });

    } catch (error) {
        console.error("Restore Category Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error restoring category",
            data: null
        });
    }
};

// koi blog permanent delete krne ke liye 
const permanentlyDeleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                data: null
            });
        }

        await Category.findByIdAndDelete(categoryId);

        return res.status(200).json({
            success: true,
            message: "Category permanently deleted",
            data: null
        });

    } catch (error) {
        console.error("Permanent Delete Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting category permanently",
            data: null
        });
    }
};

// yha se main blogs ki api start ho gi 

// yeh blog media ki api hai like image or vedio upload krne ke liye 
const uploadBlogMedia = async (req, res) => {
    try {
        const files = req.files;

        //  No files
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
                data: null
            });
        }

        // Upload to Cloudinary
        const uploadedMedia = await uploadMedia(files, "blogMedia");

        return res.status(200).json({
            success: true,
            message: "Media uploaded successfully",
            data: uploadedMedia
        });

    } catch (error) {
        console.error("Upload Blog Media Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error uploading media",
            data: null
        });
    }
};

// ab yhe api blog cover upload krne ke liye hai
const uploadBlogCover = async (req, res) => {
    try {
        const file = req.file;

        // No file
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
                data: null
            });
        }

        //  Upload to Cloudinary
        const uploaded = await uploadMedia([file], "blogCover");

        const cover = uploaded[0]; // single file

        return res.status(200).json({
            success: true,
            message: "Cover uploaded successfully",
            data: {
                url: cover.url,
                public_id: cover.public_id
            }
        });

    } catch (error) {
        console.error("Upload Cover Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error uploading cover",
            data: null
        });
    }
};

// blog create api
const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            category,
            tags,
            media,
            cover,
            visibility
        } = req.body;

        // BASIC VALIDATION (minimal, rest model handle karega)

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
                data: null
            });
        }

        //  CATEGORY EXISTENCE CHECK
        const categoryExists = await Category.findOne({
            _id: category,
            isDeleted: false
        });

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Invalid or deleted category",
                data: null
            });
        }

        // TAGS CLEANING
        let safeTags = [];
        if (tags && Array.isArray(tags)) {
            safeTags = tags.map(tag => tag.trim().toLowerCase());
        }

        // MEDIA CLEANING (important for safety)
        let safeMedia = [];
        if (media && Array.isArray(media)) {
            safeMedia = media.map(item => ({
                url: item.url,
                public_id: item.public_id || null,
                type: item.type
            }));
        }

        // VISIBILITY SAFE CHECK
        const allowedVisibility = ["public", "private"];
        const safeVisibility = allowedVisibility.includes(visibility)
            ? visibility
            : "public";

        //CREATE BLOG
        const blog = await Blog.create({
            title,            // model validate karega
            content,
            excerpt,
            category,
            tags: safeTags,
            media: safeMedia,
            cover: cover || {},
            visibility: safeVisibility,
            author: req.user._id,
            publishedAt: safeVisibility === "public" ? new Date() : null
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog
        });

    } catch (error) {
        console.error("Create Blog Error:", error);

        // MONGOOSE VALIDATION ERROR HANDLE
        if (error.name === "ValidationError") {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                data: errors
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error creating blog",
            data: null
        });
    }
};

// update blog api 
const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-");

const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        const {
            title,
            content,
            excerpt,
            category,
            tags,
            media,
            cover,
            visibility
        } = req.body;

        // FIND BLOG
        const blog = await Blog.findById(blogId);

        if (!blog || blog.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        // AUTH CHECK
        if (
            blog.author.toString() !== userId.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        // CATEGORY VALIDATION
        if (category !== undefined) {
            const categoryExists = await Category.findOne({
                _id: category,
                isDeleted: false
            });

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid or deleted category",
                    data: null
                });
            }
        }

        // ===== MEDIA HANDLING =====
        let newMedia = blog.media;

        if (Array.isArray(media)) {
            newMedia = media;

            const mediaToDelete = blog.media.filter(oldItem =>
                !newMedia.some(newItem =>
                    (newItem.public_id && newItem.public_id === oldItem.public_id) ||
                    (!newItem.public_id && newItem.url === oldItem.url)
                )
            );

            // DELETE UNUSED MEDIA
            for (const item of mediaToDelete) {
                if (item.public_id) {
                    try {
                        await cloudinary.uploader.destroy(item.public_id);
                    } catch (err) {
                        console.log("Media delete failed:", err.message);
                    }
                }
            }
        }

        // ===== COVER HANDLING =====
        let updatedCover = blog.cover;

        // REMOVE COVER
        if (cover === null) {
            if (blog.cover?.public_id) {
                try {
                    await cloudinary.uploader.destroy(blog.cover.public_id);
                } catch (err) {
                    console.log("Cover delete failed:", err.message);
                }
            }
            updatedCover = {};
        }

        // UPDATE COVER
        else if (
            cover &&
            cover.public_id !== blog.cover?.public_id
        ) {
            if (blog.cover?.public_id) {
                try {
                    await cloudinary.uploader.destroy(blog.cover.public_id);
                } catch (err) {
                    console.log("Cover delete failed:", err.message);
                }
            }

            updatedCover = cover;
        }

        // ===== TAGS =====
        let safeTags = blog.tags;
        if (tags !== undefined) {
            safeTags = Array.isArray(tags)
                ? tags.map(tag => tag.trim().toLowerCase())
                : [];
        }

        // ===== VISIBILITY =====
        const allowedVisibility = ["public", "private"];
        let safeVisibility = blog.visibility;

        if (visibility !== undefined) {
            safeVisibility = allowedVisibility.includes(visibility)
                ? visibility
                : blog.visibility;
        }

        // ===== UPDATE OBJECT =====
        const updateData = {
            title: title !== undefined ? title : blog.title,
            content: content !== undefined ? content : blog.content,
            excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
            category: category !== undefined ? category : blog.category,
            tags: safeTags,
            media: newMedia,
            cover: updatedCover,
            visibility: safeVisibility,
        };

        // ===== SLUG UPDATE =====
        if (title !== undefined) {
            updateData.slug = slugify(title);
        }

        // ===== PUBLISHED AT =====
        if (safeVisibility === "public") {
            updateData.publishedAt = blog.publishedAt || new Date();
        } else {
            updateData.publishedAt = null;
        }

        // UPDATE BLOG
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });

    } catch (error) {
        console.error("Update Blog Error:", error);

        if (error.name === "ValidationError") {
            let errors = {};

            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                data: errors
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating blog",
            data: null
        });
    }
};


// const updateBlog = async (req, res) => {
//     try {
//         const blogId = req.params.id;
//         const userId = req.user._id;

//         const {
//             title,
//             content,
//             excerpt,
//             category,
//             tags,
//             media,
//             cover,
//             visibility
//         } = req.body;

//         // FIND BLOG
//         const blog = await Blog.findById(blogId);

//         if (!blog || blog.isDeleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Blog not found",
//                 data: null
//             });
//         }

//         // AUTH CHECK
//         if (
//             blog.author.toString() !== userId.toString() &&
//             req.user.role !== "admin"
//         ) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Unauthorized",
//                 data: null
//             });
//         }

//         // CATEGORY VALIDATION (if updated)
//         if (category) {
//             const categoryExists = await Category.findOne({
//                 _id: category,
//                 isDeleted: false
//             });

//             if (!categoryExists) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Invalid or deleted category",
//                     data: null
//                 });
//             }
//         }

//         // MEDIA DIFF (CORE logic)
//         let newMedia = Array.isArray(media) ? media : blog.media;

//         const mediaToDelete = blog.media.filter(oldItem =>
//             !newMedia.some(newItem => newItem.public_id === oldItem.public_id)
//         );

//         // DELETE UNUSED MEDIA
//         for (const item of mediaToDelete) {
//             if (item.public_id) {
//                 try {
//                     await cloudinary.uploader.destroy(item.public_id);
//                 } catch (err) {
//                     console.log("Media delete failed:", err.message);
//                 }
//             }
//         }

//         // COVER HANDLE
//         let updatedCover = blog.cover;

//         if (cover && cover.public_id !== blog.cover?.public_id) {
//             // delete old cover
//             if (blog.cover?.public_id) {
//                 try {
//                     await cloudinary.uploader.destroy(blog.cover.public_id);
//                 } catch (err) {
//                     console.log("Cover delete failed:", err.message);
//                 }
//             }

//             updatedCover = cover;
//         }

//         // TAGS CLEAN
//         let safeTags = blog.tags;
//         if (tags && Array.isArray(tags)) {
//             safeTags = tags.map(tag => tag.trim().toLowerCase());
//         }

//         // VISIBILITY SAFE
//         const allowedVisibility = ["public", "private"];
//         const safeVisibility = allowedVisibility.includes(visibility)
//             ? visibility
//             : blog.visibility;

//         // UPDATE OBJECT
//         const updateData = {
//             title: title || blog.title,
//             content: content || blog.content,
//             excerpt: excerpt !== undefined ? excerpt : blog.excerpt,
//             category: category || blog.category,
//             tags: safeTags,
//             media: newMedia,
//             cover: updatedCover,
//             visibility: safeVisibility,
//             publishedAt:
//                 safeVisibility === "public"
//                     ? blog.publishedAt || new Date()
//                     : null
//         };

// // req body contains title then update slug 

//         // UPDATE BLOG
//         const updatedBlog = await Blog.findByIdAndUpdate( 
//             blogId,
//             updateData,
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Blog updated successfully",
//             data: updatedBlog
//         });

//     } catch (error) {
//         console.error("Update Blog Error:", error);

//         // VALIDATION ERROR HANDLE
//         if (error.name === "ValidationError") {
//             let errors = {};

//             Object.keys(error.errors).forEach((key) => {
//                 errors[key] = error.errors[key].message;
//             });

//             return res.status(400).json({
//                 success: false,
//                 message: "Validation failed",
//                 data: errors
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Error updating blog",
//             data: null
//         });
//     }
// };

// soft delete 
const softDeleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        // FIND BLOG
        const blog = await Blog.findById(blogId);

        if (!blog || blog.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        //AUTH CHECK
        if (
            blog.author.toString() !== userId.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        //DELETE MEDIA FROM CLOUDINARY
        for (const item of blog.media) {
            if (item.public_id) {
                try {
                    await cloudinary.uploader.destroy(item.public_id);
                } catch (err) {
                    console.log("Media delete failed:", err.message);
                }
            }
        }

        // DELETE COVER
        if (blog.cover?.public_id) {
            try {
                await cloudinary.uploader.destroy(blog.cover.public_id);
            } catch (err) {
                console.log("Cover delete failed:", err.message);
            }
        }

        // SOFT DELETE
        blog.isDeleted = true;
        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            data: null
        });

    } catch (error) {
        console.error("Delete Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error deleting blog",
            data: null
        });
    }
};

//permanent delete
const permanentlyDeleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        // FIND BLOG
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        // AUTH CHECK
        if (
            blog.author.toString() !== userId.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
                data: null
            });
        }

        // OPTIONAL SAFETY CHECK (RECOMMENDED)
        // if (!blog.isDeleted) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please delete the blog first before permanent deletion",
        //         data: null
        //     });
        // }

        //DELETE MEDIA FROM CLOUDINARY
        for (const item of blog.media) {
            if (item.public_id) {
                try {
                    await cloudinary.uploader.destroy(item.public_id);
                } catch (err) {
                    console.log("Media delete failed:", err.message);
                }
            }
        }

        // DELETE COVER
        if (blog.cover?.public_id) {
            try {
                await cloudinary.uploader.destroy(blog.cover.public_id);
            } catch (err) {
                console.log("Cover delete failed:", err.message);
            }
        }

        // DELETE FROM DB
        await Blog.findByIdAndDelete(blogId);

        return res.status(200).json({
            success: true,
            message: "Blog permanently deleted",
            data: null
        });

    } catch (error) {
        console.error("Permanent Delete Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error permanently deleting blog",
            data: null
        });
    }
};

// get blog by id
const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const user = req.user;

        const blog = await Blog.findById(blogId)
            .populate("author", "username email")
            .populate("category", "name slug");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        const isOwner = blog.author._id.toString() === user._id.toString();
        const isAdmin = user.role === "admin";

        // Deleted
        if (blog.isDeleted && !isAdmin) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        // Blocked
        if (blog.isBlocked && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "This blog is blocked",
                data: null
            });
        }

        // Private
        if (blog.visibility === "private" && !isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "This blog is private",
                data: null
            });
        }

        // Views (optimized)
        if (!isOwner && !isAdmin) {
            await Blog.findByIdAndUpdate(blogId, {
                $inc: { views: 1 }
            });
        }

        // TRANSFORM BLOG RESPONSE

        // CHECK CURRENT USER LIKED OR NOT
        const likedByCurrentUser = blog.likes.some(
            (id) => id.toString() === user?._id?.toString()
        );

        const transformedBlog = {

            // ALL EXISTING BLOG DATA
            ...blog.toObject(),

            // TOTAL LIKE COUNT
            totalLikes: blog.likes.length,

            // USER LIKE STATUS
            likedByCurrentUser
        };

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",

            // CHANGED FROM blog -> transformedBlog
            data: transformedBlog
        });

    } catch (error) {
        console.error("Get Blog Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching blog",
            data: null
        });
    }
};
// const getBlogById = async (req, res) => {
//     try {
//         const blogId = req.params.id;
//         const user = req.user;

//         const blog = await Blog.findById(blogId)
//             .populate("author", "username email")
//             .populate("category", "name slug");

//         if (!blog) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Blog not found",
//                 data: null
//             });
//         }

//         const isOwner = blog.author._id.toString() === user._id.toString();
//         const isAdmin = user.role === "admin";

//         // Deleted
//         if (blog.isDeleted && !isAdmin) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Blog not found",
//                 data: null
//             });
//         }

//         // Blocked
//         if (blog.isBlocked && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: "This blog is blocked",
//                 data: null
//             });
//         }

//         // Private
//         if (blog.visibility === "private" && !isOwner && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: "This blog is private",
//                 data: null
//             });
//         }

//         //  Views (optimized)
//         if (!isOwner && !isAdmin) {
//             await Blog.findByIdAndUpdate(blogId, {
//                 $inc: { views: 1 }
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Blog fetched successfully",
//             data: blog
//         });

//     } catch (error) {
//         console.error("Get Blog Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error fetching blog",
//             data: null
//         });
//     }
// };

// get blog by slug
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const user = req.user;

        // 🔹 Find blog by slug
        const blog = await Blog.findOne({ slug })
            .populate("author", "username email profilePic")
            .populate("category", "name slug")
            .lean();

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        const isOwner = user && blog.author._id.toString() === user._id.toString();
        const isAdmin = user && user.role === "admin";

        // Deleted check
        if (blog.isDeleted && !isAdmin) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        // Blocked check
        if (blog.isBlocked && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "This blog is blocked",
                data: null
            });
        }

        // 🔹 Private check
        if (blog.visibility === "private" && !isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "This blog is private",
                data: null
            });
        }

        // Views increment (only for public viewers)
        if (!isOwner && !isAdmin) {
            await Blog.updateOne(
                { _id: blog._id },
                { $inc: { views: 1 } }
            );
        }


        // =========================
        // TRANSFORM BLOG RESPONSE
        // =========================

        // CHECK CURRENT USER LIKED OR NOT
        const likedByCurrentUser = blog.likes.some(
            (id) => id.toString() === user?._id?.toString()
        );

        const transformedBlog = {

            // ALL EXISTING BLOG DATA
            ...blog,

            // TOTAL LIKE COUNT
            totalLikes: blog.likes.length,

            // USER LIKE STATUS
            likedByCurrentUser,

            // HIDE RAW LIKES ARRAY
            likes: undefined
        };

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully",

            // CHANGED FROM blog -> transformedBlog
            data: transformedBlog
        });

    } catch (error) {
        console.error("Get Blog By Slug Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching blog",
            data: null
        });
    }
};
// const getBlogBySlug = async (req, res) => {
//     try {
//         const { slug } = req.params;
//         const user = req.user;

//         // 🔹 Find blog by slug
//         const blog = await Blog.findOne({ slug })
//             .populate("author", "username email profilePic")
//             .populate("category", "name slug")
//             .lean();

//         if (!blog) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Blog not found",
//                 data: null
//             });
//         }

//         const isOwner = user && blog.author._id.toString() === user._id.toString();
//         const isAdmin = user && user.role === "admin";

//         // Deleted check
//         if (blog.isDeleted && !isAdmin) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Blog not found",
//                 data: null
//             });
//         }

//         // Blocked check
//         if (blog.isBlocked && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: "This blog is blocked",
//                 data: null
//             });
//         }

//         // 🔹 Private check
//         if (blog.visibility === "private" && !isOwner && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: "This blog is private",
//                 data: null
//             });
//         }

//         // Views increment (only for public viewers)
//         if (!isOwner && !isAdmin) {
//             await Blog.updateOne(
//                 { _id: blog._id },
//                 { $inc: { views: 1 } }
//             );
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Blog fetched successfully",
//             data: blog
//         });

//     } catch (error) {
//         console.error("Get Blog By Slug Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error fetching blog",
//             data: null
//         });
//     }
// };


// get all blogs 
const getAllBlogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            category,
            tag,
            sort = "latest",
            type = "blog" // blog | user
        } = req.query;

        const user = req.user;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // BASE FILTER (ALWAYS APPLIED)
        const baseFilter = {
            isDeleted: false,
            isBlocked: false
        };

        // VISIBILITY FILTER
        if (user?.role !== "admin") {
            baseFilter.$or = [
                { visibility: "public" },
                { author: user?._id }
            ];
        }

        // MAIN FILTER ARRAY ($and based)
        let andFilters = [baseFilter];

        // SEARCH LOGIC
        if (search) {
            if (type === "blog") {
                andFilters.push({
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { tags: { $in: [new RegExp(search, "i")] } }
                    ]
                });
            }

            if (type === "user") {
                const users = await User.find({
                    username: { $regex: search, $options: "i" }
                }).select("_id");

                const userIds = users.map(u => u._id);

                andFilters.push({
                    author: { $in: userIds.length ? userIds : [null] }
                });
            }
        }

        // CATEGORY FILTER (MULTIPLE)
        if (category) {

            const categories = category
                .split(",")
                .map(id => id.trim())
                .filter(id => mongoose.Types.ObjectId.isValid(id));

            if (categories.length > 0) {
                andFilters.push({
                    category: {
                        $in: categories.map(id => new mongoose.Types.ObjectId(id))
                    }
                });
            }
        }

        // TAG FILTER
        if (tag) {
            andFilters.push({
                tags: { $in: [tag.toLowerCase()] }
            });
        }

        // FINAL FILTER
        const finalFilter = { $and: andFilters };

        // SORTING
        let sortOption = {};

        if (sort === "popular") {
            sortOption = { views: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        // QUERY
        const blogs = await Blog.find(finalFilter)
            .populate("author", "username profilePic")
            .populate("category", "name slug")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean();

        // TRANSFORM BLOG RESPONSE

        const transformedBlogs = blogs.map((blog) => {

            // CHECK CURRENT USER LIKED OR NOT
            const likedByCurrentUser = blog.likes.some(
                (id) => id.toString() === user?._id?.toString()
            );

            return {

                // ALL EXISTING BLOG DATA
                ...blog,

                // TOTAL LIKE COUNT
                totalLikes: blog.likes.length,

                // USER LIKE STATUS
                likedByCurrentUser,

                // HIDE RAW LIKES ARRAY
                likes: undefined
            };
        });

        const total = await Blog.countDocuments(finalFilter);

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            // CHANGED FROM blogs -> transformedBlogs
            data: transformedBlogs,

            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error("Get All Blogs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching blogs",
            data: null
        });
    }
};

const getUserBlogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = req.user;

        const {
            page = 1,
            limit = 10,
            sort = "latest"
        } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const isOwner = user._id.toString() === userId;
        const isAdmin = user.role === "admin";

        // BASE FILTER
        let filter = {
            author: userId,
            isDeleted: false
        };

        // ACCESS CONTROL
        if (!isOwner && !isAdmin) {
            filter.visibility = "public";
            filter.isBlocked = false;
        }

        // SORT
        let sortOption = {};

        if (sort === "popular") {
            sortOption = { views: -1 };
        } else {
            sortOption = { createdAt: -1 };
        }

        // QUERY
        const blogs = await Blog.find(filter)
            .populate("category", "name slug")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean();


        // =========================
        // TRANSFORM BLOG RESPONSE
        // =========================

        const transformedBlogs = blogs.map((blog) => {

            // CHECK CURRENT USER LIKED OR NOT
            const likedByCurrentUser = blog.likes.some(
                (id) => id.toString() === user?._id?.toString()
            );

            return {

                // ALL EXISTING BLOG DATA
                ...blog,

                // TOTAL LIKE COUNT
                totalLikes: blog.likes.length,

                // USER LIKE STATUS
                likedByCurrentUser
            };
        });

        const total = await Blog.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "User blogs fetched successfully",

            // CHANGED FROM blogs -> transformedBlogs
            data: transformedBlogs,

            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (error) {
        console.error("Get User Blogs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching user blogs",
            data: null
        });
    }
};
// const getAllBlogs = async (req, res) => {
//     try {
//         const {
//             page = 1,
//             limit = 10,
//             search = "",
//             category,
//             tag,
//             sort = "latest",
//             type = "blog" // blog | user
//         } = req.query;

//         const user = req.user;

//         const pageNum = parseInt(page);
//         const limitNum = parseInt(limit);
//         const skip = (pageNum - 1) * limitNum;

//         // BASE FILTER (ALWAYS APPLIED)
//         const baseFilter = {
//             isDeleted: false,
//             isBlocked: false
//         };

//         // VISIBILITY FILTER
//         if (user?.role !== "admin") {
//             baseFilter.$or = [
//                 { visibility: "public" },
//                 { author: user?._id }
//             ];
//         }

//         // MAIN FILTER ARRAY ($and based)
//         let andFilters = [baseFilter];

//         // SEARCH LOGIC
//         if (search) {
//             if (type === "blog") {
//                 andFilters.push({
//                     $or: [
//                         { title: { $regex: search, $options: "i" } },
//                         { tags: { $in: [new RegExp(search, "i")] } }
//                     ]
//                 });
//             }

//             if (type === "user") {
//                 const users = await User.find({
//                     username: { $regex: search, $options: "i" }
//                 }).select("_id");

//                 const userIds = users.map(u => u._id);

//                 andFilters.push({
//                     author: { $in: userIds.length ? userIds : [null] }
//                 });
//             }
//         }

//         // CATEGORY FILTER (MULTIPLE)
//         if (category) {
//             //console.log("Category Query:", category);
//             const categories = category
//                 .split(",")
//                 .map(id => id.trim())
//                 .filter(id => mongoose.Types.ObjectId.isValid(id));

//             if (categories.length > 0) {
//                 andFilters.push({
//                     category: {
//                         $in: categories.map(id => new mongoose.Types.ObjectId(id))
//                     }
//                 });
//             }
//         }

//         // TAG FILTER
//         if (tag) {
//             andFilters.push({
//                 tags: { $in: [tag.toLowerCase()] }
//             });
//         }

//         // FINAL FILTER
//         const finalFilter = { $and: andFilters };

//         // SORTING
//         let sortOption = {};
//         if (sort === "popular") {
//             sortOption = { views: -1 };
//         } else {
//             sortOption = { createdAt: -1 };
//         }

//         // QUERY
//         const blogs = await Blog.find(finalFilter)
//             .populate("author", "username profilePic")
//             .populate("category", "name slug")
//             .sort(sortOption)
//             .skip(skip)
//             .limit(limitNum)
//             .lean();

//         const total = await Blog.countDocuments(finalFilter);

//         return res.status(200).json({
//             success: true,
//             message: "Blogs fetched successfully",
//             data: blogs,
//             pagination: {
//                 total,
//                 page: pageNum,
//                 limit: limitNum,
//                 totalPages: Math.ceil(total / limitNum)
//             }
//         });

//     } catch (error) {
//         console.error("Get All Blogs Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error fetching blogs",
//             data: null
//         });
//     }
// };


// user ke apne blogs dekhne ke liye 

// const getUserBlogs = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const user = req.user;

//         const {
//             page = 1,
//             limit = 10,
//             sort = "latest"
//         } = req.query;

//         const pageNum = parseInt(page);
//         const limitNum = parseInt(limit);
//         const skip = (pageNum - 1) * limitNum;

//         const isOwner = user._id.toString() === userId;
//         const isAdmin = user.role === "admin";

//         // BASE FILTER
//         let filter = {
//             author: userId,
//             isDeleted: false
//         };

//         // ACCESS CONTROL
//         if (!isOwner && !isAdmin) {
//             filter.visibility = "public";
//             filter.isBlocked = false;
//         }

//         // SORT
//         let sortOption = {};
//         if (sort === "popular") {
//             sortOption = { views: -1 };
//         } else {
//             sortOption = { createdAt: -1 };
//         }

//         // QUERY
//         const blogs = await Blog.find(filter)
//             .populate("category", "name slug")
//             .sort(sortOption)
//             .skip(skip)
//             .limit(limitNum);

//         const total = await Blog.countDocuments(filter);

//         return res.status(200).json({
//             success: true,
//             message: "User blogs fetched successfully",
//             data: blogs,
//             pagination: {
//                 total,
//                 page: pageNum,
//                 limit: limitNum,
//                 totalPages: Math.ceil(total / limitNum)
//             }
//         });

//     } catch (error) {
//         console.error("Get User Blogs Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error fetching user blogs",
//             data: null
//         });
//     }
// };

// featured blogs latest 4.
const getFeaturedBlogs = async (req, res) => {
    try {
        //FILTER
        const filter = {
            isDeleted: false,
            isBlocked: false,
            visibility: "public"
        };

        // FETCH (latest 4)
        const blogs = await Blog.find(filter)
            .populate("author", "username")
            .populate("category", "name slug")
            .sort({ createdAt: -1 }) // latest
            .limit(4);

        return res.status(200).json({
            success: true,
            message: "Featured blogs fetched successfully",
            data: blogs
        });

    } catch (error) {
        console.error("Featured Blogs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error fetching featured blogs",
            data: null
        });
    }
};

// like api
const toggleLike = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const userId = req.user._id;

        // Find Blog
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        // Deleted Blog
        if (blog.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
                data: null
            });
        }

        // Blocked Blog
        if (blog.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "This blog is blocked",
                data: null
            });
        }

        // Check already liked or not
        const alreadyLiked = blog.likes.includes(userId);

        // Unlike
        if (alreadyLiked) {
            blog.likes.pull(userId);

            await blog.save();

            return res.status(200).json({
                success: true,
                message: "Blog unliked successfully",
                data: {
                    liked: false,
                    totalLikes: blog.likes.length
                }
            });
        }

        // Like
        blog.likes.push(userId);

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog liked successfully",
            data: {
                liked: true,
                totalLikes: blog.likes.length
            }
        });

    } catch (error) {
        console.error("Toggle Like Error:", error);

        return res.status(500).json({
            success: false,
            message: "Error toggling like",
            data: null
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
    restoreCategory,
    permanentlyDeleteCategory,
    uploadBlogMedia,
    uploadBlogCover,
    createBlog,
    updateBlog,
    softDeleteBlog,
    permanentlyDeleteBlog,
    getBlogById,
    getAllBlogs,
    getUserBlogs,
    getFeaturedBlogs,
    getBlogBySlug,
    toggleLike
}


// yeh baad mai jb blog model bn jaye ga tbb implement kre ge hum yeh like delete krne se pehle ke check ki koi blog already hai ki nhi



// const deleteCategory = async (req, res) => {
//     try {
//         const categoryId = req.params.id;

//         const category = await Category.findById(categoryId);

//         if (!category || category.isDeleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found",
//                 data: null
//             });
//         }

//         //  NEW CHECK
//         const isUsed = await Blog.findOne({
//             category: categoryId,
//             isDeleted: false
//         });

//         if (isUsed) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category is in use and cannot be deleted",
//                 data: null
//             });
//         }

//         category.isDeleted = true;
//         await category.save();

//         return res.status(200).json({
//             success: true,
//             message: "Category deleted successfully",
//             data: null
//         });

//     } catch (error) {
//         console.error("Delete Category Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error deleting category",
//             data: null
//         });
//     }
// };

// yha se restore krne wali

// const restoreCategory = async (req, res) => {
//     try {
//         const categoryId = req.params.id;

//         const category = await Category.findById(categoryId);

//         if (!category || !category.isDeleted) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found or not deleted",
//                 data: null
//             });
//         }

//         category.isDeleted = false;
//         await category.save();

//         return res.status(200).json({
//             success: true,
//             message: "Category restored successfully",
//             data: category
//         });

//     } catch (error) {
//         console.error("Restore Category Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error restoring category",
//             data: null
//         });
//     }
// };



// yha se permanent wali

// const permanentlyDeleteCategory = async (req, res) => {
//     try {
//         const categoryId = req.params.id;

//         const category = await Category.findById(categoryId);

//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Category not found",
//                 data: null
//             });
//         }

//         //  NEW CHECK (VERY IMPORTANT)
//         const isUsed = await Blog.findOne({
//             category: categoryId,
//             isDeleted: false
//         });

//         if (isUsed) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Category is in use and cannot be permanently deleted",
//                 data: null
//             });
//         }

//         await Category.findByIdAndDelete(categoryId);

//         return res.status(200).json({
//             success: true,
//             message: "Category permanently deleted",
//             data: null
//         });

//     } catch (error) {
//         console.error("Permanent Delete Error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Error deleting category permanently",
//             data: null
//         });
//     }
// };