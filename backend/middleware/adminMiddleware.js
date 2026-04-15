exports.isAdmin = (req, res, next) => {
  try {
    // Check user exists (authMiddleware ke baad)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
        data: null,
        error: null,
      });
    }

    // Check role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
        data: null,
        error: null,
      });
    }

    // (Optional) Super admin check
    if (process.env.SUPER_ADMIN_EMAIL && req.user.email !== process.env.SUPER_ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Super admin only",
        data: null,
        error: null,
      });
    }

    next();

  } catch (error) {
    console.log("Admin Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authorization error",
      data: null,
      error: error.message,
    });
  }
};