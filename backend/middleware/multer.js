const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Max limit (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Temp folder (single source of truth)
const TEMP_DIR = "uploads/temp";

// Ensure temp folder exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Storage config (NO TYPE LOGIC HERE)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR); // always temp
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, uniqueName + ext);
  },
});

// File filter (image + video only)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("video")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images & videos allowed"), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Multiple (blog)
const uploadMultiple = upload.array("media", 10);

// Single (profile / cover)
const uploadSingle = upload.single("media");

module.exports = {
  uploadMultiple,
  uploadSingle,
};

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Max limit (global)
// const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB

// // Helper → ensure folder exists
// const ensureDir = (dirPath) => {
//     if (!fs.existsSync(dirPath)) {
//         fs.mkdirSync(dirPath, { recursive: true }); //ested folders create karne ke liye
//     }
// };

// // Storage config
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const type = req.body.type;

//         let folder = "uploads/";

//         switch (type) {
//             case "blogImage":
//                 folder += "blog/images";
//                 break;
//             case "blogVideo":
//                 folder += "blog/videos";
//                 break;
//             case "blogCover":
//                 folder += "blog/covers";
//                 break;
//             case "profile":
//                 folder += "user/profilePics";
//                 break;
//             case "profileCover":
//                 folder += "user/cover";
//                 break;
//             default:
//                 return cb(new Error("Invalid upload type"), false);
//         }

//         // Ensure folder exists
//         ensureDir(folder);

//         cb(null, folder);
//     },

//     filename: function (req, file, cb) {
//         const uniqueName =
//             Date.now() + "-" + Math.round(Math.random() * 1e9);

//         const ext = path.extname(file.originalname);

//         cb(null, uniqueName + ext);
//     },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//     if (
//         file.mimetype.startsWith("image") ||
//         file.mimetype.startsWith("video")
//     ) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only images & videos allowed"), false);
//     }
// };

// const upload = multer({
//     storage,
//     fileFilter,
//     limits: {
//         fileSize: MAX_VIDEO_SIZE,
//     },
// });

// // Multiple upload (blog)
// const uploadMultiple = upload.array("media", 10);

// // Single upload (profile/cover)
// const uploadSingle = upload.single("media");

// module.exports = {
//     uploadMultiple,
//     uploadSingle,
// };