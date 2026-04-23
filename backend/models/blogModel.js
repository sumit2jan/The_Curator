const mongoose = require("mongoose");
const Joi = require("joi");

const BLOG_TYPES = ["text", "video", "audio", "image-gallery"];
const BLOG_STATUSES = ["draft", "published", "scheduled"];

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ["text", "video", "audio", "image-gallery"],
            default: "text",
        },
        coverImage: { type: String, default: "default-cover.jpg" },
        images: [String],
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: [String],
        category: { type: String, required: true },
        status: {
            type: String,
            enum: ["draft", "published", "scheduled"],
            default: "draft",
        },
        publishedAt: { type: Date },
        scheduledFor: { type: Date },
        viewsCount: { type: Number, default: 0 },
        likesCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);
const Blog = mongoose.model("Blog", blogSchema);

const objectId = Joi.string()
    .pattern(/^[a-f\d]{24}$/i)
    .message("Must be a valid MongoDB ObjectId");

const blogJoiSchema = Joi.object({
    title: Joi.string().trim().messages({
        "string.empty": "Title cannot be empty",
    }),

    content: Joi.string().messages({
        "string.empty": "Content cannot be empty",
    }),

    type: Joi.string()
        .valid(...BLOG_TYPES)
        .default("text")
        .messages({ "any.only": `Type must be one of: ${BLOG_TYPES.join(", ")}` }),

    coverImage: Joi.string().default("default-cover.jpg"),

    images: Joi.array().items(Joi.string()).default([]),

    authorId: objectId.optional(),

    // tags and category come from external API — stored as-is, light validation only
    tags: Joi.array().items(Joi.string().trim()).default([]),
    category: Joi.string().trim().messages({
        "string.empty": "Category cannot be empty",
    }),

    status: Joi.string()
        .valid(...BLOG_STATUSES)
        .default("draft")
        .messages({
            "any.only": `Status must be one of: ${BLOG_STATUSES.join(", ")}`,
        }),

    publishedAt: Joi.date().iso().messages({
        "date.format": "publishedAt must be a valid ISO date",
    }),

    scheduledFor: Joi.date()
        .iso()
        .when("status", {
            is: "scheduled",
            then: Joi.required().messages({
                "any.required": "scheduledFor is required when status is 'scheduled'",
            }),
        })
        .messages({ "date.format": "scheduledFor must be a valid ISO date" }),
});
// Remove 'authorId' from this list because it's now handled by the Token
const REQUIRED_ON_CREATE = ["title", "content", "category"];
const validate = (operation) => (req, res, next) => {
    const schema =
        operation === "update"
            ? blogJoiSchema
                .fork(REQUIRED_ON_CREATE, (field) => field.optional())
                .min(1)
                .messages({ "object.min": "Provide at least one field to update" })
            : blogJoiSchema.fork(REQUIRED_ON_CREATE, (field) => field.required());

    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });

    if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ status: "fail", errors });
    }

    req.body = value;
    next();
};

module.exports = { Blog, validate };