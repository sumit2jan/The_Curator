const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in the environment");
        }

        await mongoose.connect(mongoUri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
