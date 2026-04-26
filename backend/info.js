/*

# FULL MEDIA UPLOAD SYSTEM (PROFILE PIC) — EXPLANATION

🔹 OVERVIEW:
Ye system user ki profile picture upload karta hai using:

* Multer (file handling)
* Cloudinary (cloud storage)
* Local fallback (backup)
* MongoDB (URL store)

---

🔹 STEP 1: FRONTEND (USER ACTION)

User:

* profile image pe click karta hai
* file select karta hai

Frontend:
FormData banata hai:

formData.append("media", file);
formData.append("type", "profile");

👉 "media" = file key (IMPORTANT)
👉 "type" = backend ko batata hai kis folder me save karna hai

---

🔹 STEP 2: API CALL

POST /user/upload-profile-pic

Request:

* multipart/form-data
* media = file
* type = profile

---

🔹 STEP 3: MULTER (middleware)

Role:

* file receive karta hai
* uploads/temp folder me save karta hai

IMPORTANT:

* Multer ab koi logic nahi karta
* sirf temporary storage handle karta hai

Example:
uploads/temp/abc123.jpg

---

🔹 STEP 4: CONTROLLER

Controller function:
uploadProfilePic()

Kaam:

1. req.file leta hai (multer se)
2. userId leta hai (authMiddleware se)
3. uploadMedia() function call karta hai

---

🔹 STEP 5: uploadMedia.js (MAIN BRAIN)

Yaha real logic hota hai:

FOR EACH FILE:

1. File type check:

   * image ya video

2. Size validation:

   * image <= 5MB
   * video <= 20MB

3. Folder mapping:
   type ke basis pe:

   profile → user/profilePics
   blogImage → blog/images
   etc...

---

🔹 STEP 6: CLOUDINARY UPLOAD

Try block me:

cloudinary.uploader.upload(file.path, {
folder: "user/profilePics",
resource_type: "image"
})

SUCCESS:

* Cloudinary URL milta hai
* local temp file delete ho jati hai

Example:
https://res.cloudinary.com/.../profilePics/image.jpg

---

🔹 STEP 7: FALLBACK SYSTEM (VERY IMPORTANT)

Agar Cloudinary fail ho:

catch block:

* error log hota hai
* local file use hoti hai

Example:
"/uploads/temp/abc.jpg"

👉 isse system kabhi crash nahi hota

---

🔹 STEP 8: DATABASE UPDATE

Controller:

UserDetail.findOneAndUpdate(
{ userId },
{ profilePic: imageUrl }
)

👉 Cloudinary ya local URL DB me store hota hai

---

🔹 STEP 9: RESPONSE

API return karta hai:

{
success: true,
profilePic: "https://..."
}

---

🔹 FINAL FLOW SUMMARY

User
↓
Frontend (FormData)
↓
API
↓
Multer (temp save)
↓
uploadMedia (logic)
↓
Cloudinary (try)
↓
Fallback (if fail)
↓
DB update
↓
Response

---

🔹 WHY THIS SYSTEM IS POWERFUL

✔️ Scalable (images + videos)
✔️ Safe (fallback system)
✔️ Fast (Cloudinary CDN)
✔️ Clean architecture
✔️ Reusable for blog, profile, cover

---

🔹 KEY LEARNINGS

* Multer = file handler only
* uploadMedia = main logic
* Cloudinary = primary storage
* Local = backup system
* "type" = folder controller

---

🔹 FINAL STATUS

✔️ Backend complete
✔️ Cloud upload working
✔️ Fallback working
✔️ DB sync working

👉 Production-ready feature 🚀

========================================================
*/
