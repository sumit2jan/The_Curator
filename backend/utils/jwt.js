const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "15min" }
    );
};

const generateRefreshToken = (userId) => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_SECRET is missing");
    }
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );
};

// Verify Token
const verifyAccesToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
    generateRefreshToken,
    generateAccessToken,
    verifyRefreshToken,
    verifyAccesToken,
};