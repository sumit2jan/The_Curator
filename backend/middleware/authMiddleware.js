const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


// abhi hum manualy bhejte hai postman pe 
const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // No token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided",
                data: null,
                error: null,
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. User not found",
                data: null,
                error: null,
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        console.log("error:" + error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            data: null,
            error: error.message,
        });
    }
};

module.exports = authMiddleware;

