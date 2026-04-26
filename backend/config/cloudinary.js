const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

 /*

## CLOUDINARY CONFIG FILE

Purpose:

* Cloudinary ko initialize karna with credentials
* Ye file ek baar config karegi, phir poore project me reuse hogi

.env se values aati hain:

* CLOUDINARY_CLOUD_NAME
* CLOUDINARY_API_KEY
* CLOUDINARY_API_SECRET

Flow:

* Backend start hota hai
* Ye config load hoti hai
* Jab bhi upload call hoga → Cloudinary ready rahega

Important:

* Credentials kabhi hardcode mat karna
* Always .env use karo

---

*/
