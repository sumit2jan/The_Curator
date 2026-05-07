require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const passport = require("./config/passport");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static
app.use("/uploads", express.static("uploads"));

// DB
connectDB();
app.use(passport.initialize())
// Routes
app.use("/thecurator", require("./routes"));

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
