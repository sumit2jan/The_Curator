require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/blogCategoryModel");

const MONGO_URI = process.env.MONGO_URI;

const ADMIN_ID = "69df685675f1f6a4fd6c9d6d";

const categories = [
    "Technology",
    "Programming",
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Cyber Security",
    "Cloud Computing",
    "DevOps",

    "Travel",
    "Food",
    "Fitness",
    "Health",
    "Lifestyle",

    "Business",
    "Finance",
    "Startups",
    "Marketing",
    "Entrepreneurship",

    "Education",
    "Career",
    "Productivity",
    "Self Improvement",

    "Entertainment",
    "Movies",
    "Music",
    "Gaming",

    "Sports",
    "News",
    "Politics"
];

const seedCategories = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB connected");

        for (const name of categories) {
            const exists = await Category.findOne({ name });

            if (!exists) {
                await Category.create({
                    name,
                    description: `${name} related blogs`,
                    createdBy: ADMIN_ID
                });
                console.log(`Created: ${name}`);
            } else {
                console.log(`Skipped: ${name}`);
            }
        }

        console.log("Seeding complete ✅");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedCategories();