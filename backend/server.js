const express = require('express');
require("dotenv").config();
const connectDB = require('./config/db');
const app = express();
const cors = require("cors");

app.use(cors());
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/blog", require("./routes/authRoute"));
app.use("/blog", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
