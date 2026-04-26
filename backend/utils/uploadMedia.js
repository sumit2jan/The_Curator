const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Helper → delete local file
const deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Main upload function
const uploadMedia = async (files, type) => {
  const results = [];

  for (const file of files) {
    try {
      //  File type detect
      const isImage = file.mimetype.startsWith("image");
      const isVideo = file.mimetype.startsWith("video");

      //  Size validation
      if (isImage && file.size > 5 * 1024 * 1024) {
        throw new Error("Image exceeds 5MB");
      }
      if (isVideo && file.size > 20 * 1024 * 1024) {
        throw new Error("Video exceeds 20MB");
      }

      // Folder mapping
      let folder = "";

      switch (type) {
        case "blogImage":
          folder = "blog/images";
          break;
        case "blogVideo":
          folder = "blog/videos";
          break;
        case "blogCover":
          folder = "blog/covers";
          break;
        case "profile":
          folder = "user/profilePics";
          break;
        case "profileCover":
          folder = "user/cover";
          break;
        default:
          throw new Error("Invalid upload type");
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: isVideo ? "video" : "image",
      });

      // Delete local file (success)
      deleteLocalFile(file.path);

      // Save URL
      results.push({
        url: result.secure_url,
        public_id: result.public_id,
      });


    } catch (error) {
      console.log("Cloudinary failed, using local:", error.message);

      // fallback → local path
      const localPath = file.path.replace(/\\/g, "/");

      results.push({
        url: `/${localPath}`,
        public_id: null,
      });
    }
  }

  return results;
};

module.exports = uploadMedia;





/*

## UPLOAD MEDIA (MAIN BRAIN OF SYSTEM)

Purpose:

* Multer se aaye hue files ko handle karna
* Cloudinary pe upload karna
* Agar fail ho → local file use karna (fallback)
* Final usable URL return karna

---

FLOW:

1. Multer files deta hai:
  req.files → array of files

2. Har file pe loop chalta hai:
  for (const file of files)

3. File type detect:

  * image (file.mimetype.startsWith("image"))
  * video (file.mimetype.startsWith("video"))

4. Size validation:

  * image > 5MB → reject
  * video > 20MB → reject

5. Folder mapping:
  type ke basis pe decide hota hai:

  * blogImage → blog/images
  * blogVideo → blog/videos
  * blogCover → blog/covers
  * profile → user/profile
  * profileCover → user/cover

6. Cloudinary upload try:
  cloudinary.uploader.upload(file.path, { folder, resource_type })

  resource_type:

  * image → "image"
  * video → "video"

7. SUCCESS CASE:

  * Cloudinary URL milta hai (secure_url)
  * local file delete kar dete hain (storage bachane ke liye)
  * result array me URL push

8. FAIL CASE (IMPORTANT):

  * error catch hota hai
  * Cloudinary fail hone par:
    → local file ko hi use karte hain
    → path return kar dete hain

  Example:
  "/uploads/blog/images/xyz.jpg"

9. Final return:

  * URLs ka array return hota hai

---

WHY THIS SYSTEM IS POWERFUL:

* Cloudinary primary (fast, CDN)
* Local fallback (no crash, no data loss)
* Same code → images + videos handle
* Multiple files support
* Scalable for future

---

IMPORTANT NOTES:

* Kabhi bhi throw error mat karo inside loop
 → warna pura upload fail ho jayega

* Always fallback use karo

* Local file delete sirf tab jab Cloudinary success ho

---

FINAL OUTPUT FORMAT:

[
"https://cloudinary-url.com/...",
"/uploads/blog/images/local-file.jpg"
]

Frontend ko farak nahi padega → dono valid URLs hain

---

*/


//Controller me kaise use kare


// const uploadMedia = require("../utils/uploadMedia");

// const createBlog = async (req, res) => {
//   try {
//     const files = req.files;
//     const type = req.body.type;

//     const mediaUrls = await uploadMedia(files, type);

//     res.json({
//       success: true,
//       data: mediaUrls,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };