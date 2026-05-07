const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            maxlength: 200,
            default: "",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);


//SINGLE CLEAN PRE-SAVE HOOK (Slug + Unique Handling)

categorySchema.pre("save", async function () {
    if (!this.isModified("name")) return;

    let baseSlug = slugify(this.name, {
        lower: true,
        strict: true,
    });

    let slug = baseSlug;
    let count = 1;

    const Category = mongoose.model("Category");

    while (
        await Category.findOne({
            slug,
            _id: { $ne: this._id },
            isDeleted: false,
        })
    ) {
        slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
});

module.exports = mongoose.model("Category", categorySchema);