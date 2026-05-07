const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    excerpt: {
      type: String,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    cover: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    // MEDIA TRACKING
    media: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          default: null,
        },
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    views: {
      type: Number,
      default: 0,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }

);

blogSchema.index({ title: "text", tags: "text" });
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });

// SLUG GENERATION
blogSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true,
  });

  // ensure _id exists
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }

  // take last 12 characters of ObjectId
  const uniquePart = this._id.toString().slice(-12);

  this.slug = `${baseSlug}-${uniquePart}`;
});

module.exports = mongoose.model("Blog", blogSchema);

// const mongoose = require("mongoose");
// const slugify = require("slugify");

// const blogSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 5,
//       maxlength: 150,
//     },

//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//     },

//     content: {
//       type: String,
//       required: true,
//     },

//     excerpt: {
//       type: String,
//       maxlength: 300,
//       default: "",
//     },

//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       required: true,
//     },

//     tags: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],

//     cover: {
//       url: {
//         type: String,
//         default: "",
//       },
//       public_id: {
//         type: String,
//         default: "",
//       },
//     },

//     // MEDIA TRACKING
//     media: [
//       {
//         url: String,
//         public_id: String,
//         type: {
//           type: String,
//           enum: ["image", "video"],
//         },
//       },
//     ],

//     // LIKES
//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     views: {
//       type: Number,
//       default: 0,
//     },

//     visibility: {
//       type: String,
//       enum: ["public", "private"],
//       default: "public",
//     },

//     isBlocked: {
//       type: Boolean,
//       default: false,
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },

//     publishedAt: {
//       type: Date,
//     },
//   },
//   { timestamps: true }
// );


// //  SLUG GENERATION (UNIQUE)

// blogSchema.pre("save", async function () {
//   if (!this.isModified("title")) return;

//   let baseSlug = slugify(this.title, {
//     lower: true,
//     strict: true,
//   });

//   let slug = baseSlug;
//   let count = 1;

//   const Blog = mongoose.model("Blog");

//   while (
//     await Blog.findOne({
//       slug,
//       _id: { $ne: this._id },
//       isDeleted: false,
//     })
//   ) {
//     slug = `${baseSlug}-${count++}`;
//   }

//   this.slug = slug;
// });


// module.exports = mongoose.model("Blog", blogSchema);