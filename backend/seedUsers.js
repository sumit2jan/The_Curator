const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/userModel");
const UserDetail = require("./models/userDetail");

const connectDB = require("./config/db");

const seedUsers = async () => {
    try {
        await connectDB();

        // 🔥 Clear old data (optional)
        // await User.deleteMany();
        // await UserDetail.deleteMany();

        for (let i = 1; i <= 30; i++) {
            const hashedPassword = await bcrypt.hash("test@1234", 10);

            const user = await User.create({
                email: `user${i}@yopmail.com`,
                username: `user${i}`,
                password: hashedPassword,
                role: "user",
                isVerified: i % 2 === 0
            });

            await UserDetail.create({
                userId: user._id,
                firstName: `User${i}`,
                lastName: "Test",
                gender: i % 2 === 0 ? "Male" : "Female",
                country: "India",
                bio: `Hi, I am user${i}`,
                dob: new Date(2000, i % 12, i)
            });
        }

        console.log("🔥 30 YOPMAIL Users Seeded Successfully");
        process.exit();

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedUsers();