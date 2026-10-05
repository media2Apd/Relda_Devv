const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;

        // 👉 zohoLocationId and zohoLocationName destructure panrom
        const { userId, email, name, role, zohoLocationId, zohoLocationName } = req.body;

        const payload = {
            ...(email && { email: email }),
            ...(name && { name: name }),
            ...(role && { role: role }),
            // 👉 MANAGESALES role-ku mattum location save aagum, vera role-ku maathina location remove aagidum
            ...(role === "MANAGESALES" ? {
                zohoLocationId: zohoLocationId || null,
                zohoLocationName: zohoLocationName || null
            } : (role ? {
                zohoLocationId: null,
                zohoLocationName: null
            } : {}))
        };

        const user = await userModel.findById(sessionUser);

        console.log("👤 User role being updated by admin:", user?.role);
        console.log("📍 Location Payload to save:", {
            role,
            zohoLocationId: payload.zohoLocationId,
            zohoLocationName: payload.zohoLocationName
        });

        // { new: true } pottal update aana latest user document return aagum
        const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

        res.json({
            data: updatedUser,
            message: "User Updated Successfully",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateUser;