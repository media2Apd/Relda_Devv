const userModel = require("../models/userModel");

const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Access denied: You do not have admin privileges",
                error: true,
                success: false
            });
        }

        // If user is an admin, proceed to the next middleware/controller
        next();
    } catch (err) {
        return res.status(500).json({
            message: err.message || "An error occurred while verifying admin role",
            error: true,
            success: false
        });
    }
};

module.exports = isAdmin;
