const gemini = require("../service/gemini");
const { body, validationResult } = require("express-validator");

const generateBlog = async (req, res) => {

    try {

        const {
            topic,
            category,
            tone,
            words,
            tags,
        } = req.body;

        const prompt = `
        Write a ${tone} blog.

        Topic: ${topic}

        Category: ${category}

        Tags: ${tags.join(", ")}

        Word Limit: ${words}

        Requirements:
        - Return response in proper markdown format
        - SEO Optimized
        - Catchy Introduction
        - Use headings/subheadings
        - Professional formatting
        - Engaging conclusion
        - Strong conclusion
        - Use bullet points where needed
        `;

        const result = await gemini.generateContent(prompt);

        const response = result.response.text();

        res.status(200).json({
            success: true,
            markdown: response,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const validateGenerateBlog = [

    body("topic")
        .trim()
        .notEmpty()
        .withMessage("Topic is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Topic must be between 3 and 100 characters"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("tone")
        .trim()
        .notEmpty()
        .withMessage("Tone is required"),

    body("words")
        .notEmpty()
        .withMessage("Words field is required")
        .isInt({ min: 100, max: 3000 })
        .withMessage("Words must be between 100 and 3000"),

    body("tags")
        .isArray({ min: 1 })
        .withMessage("Tags must be an array"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        next();
    },
];




module.exports = {
    generateBlog, validateGenerateBlog
};