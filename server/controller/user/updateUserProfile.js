const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel'); // Ensure the path is correct

// const getUserController = async (req, res) => {
//   try {
//     const { userId } = req.params; // Get userId from request parameters

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required.", error: true, success: false });
//     }

//     const user = await userModel.findById(userId); // Find user by ID

//     if (!user) {
//       return res.status(404).json({ message: "User not found.", error: true, success: false });
//     }

//     res.status(200).json({ data: user, success: true, error: false, message: "User retrieved successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message || err, error: true, success: false });
//   }
// };

const mongoose = require('mongoose');
const { createZohoCustomer, updateZohoCustomer } = require("../../services/zohoCustomer.service");
const getUserController = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    if (!userId) {
      return res.status(400).json({ message: "User ID is required.", error: true, success: false });
    }

    // Trim the userId to remove any extra whitespace or new lines
    const trimmedUserId = userId.trim();

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(trimmedUserId)) {
      return res.status(400).json({ message: "Invalid User ID format.", error: true, success: false });
    }

    // Attempt to find the user by ID
    const user = await userModel.findById(trimmedUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found.", error: true, success: false });
    }

    res.status(200).json({ data: user, success: true, error: false, message: "User retrieved successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};



// const updateUserController = async (req, res) => {
//   try {
//     const userId = req.params.userId; // Correctly extract userId from req.params
//     const { name, password, profilePic, mobile, address } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required.", error: true, success: false });
//     }

//     const updateFields = {};
//     if (name) updateFields.name = name;
//     if (password) {
//       const salt = bcrypt.genSaltSync(10);
//       updateFields.password = bcrypt.hashSync(password, salt);
//     }
//     if (profilePic) updateFields.profilePic = profilePic;
//     if (mobile) updateFields.mobile = mobile;
//     if (address) updateFields.address = address;

//     // Update user and return updated user
//     const updatedUser = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found.", error: true, success: false });
//     }

//     res.status(200).json({ data: updatedUser, success: true, error: false, message: "User updated successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: err.message || err, error: true, success: false });
//   }
// };
const updateUserController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, password, profilePic, mobile, address } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required."
      });
    }

    /* -----------------------
       Build update object
    ------------------------*/
    const updateFields = {};

    if (name) updateFields.name = name;

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      updateFields.password = bcrypt.hashSync(password, salt);
    }

    if (profilePic) updateFields.profilePic = profilePic;
    if (mobile) updateFields.mobile = mobile;

    // ⚠️ Prevent empty address object breaking validation
    if (address && Object.keys(address).length > 0) {
      updateFields.address = address;
    }

    /* -----------------------
       Update user in DB
    ------------------------*/
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    /* -----------------------
       🔥 ZOHO SYNC LOGIC
    ------------------------*/
    try {
      if (!updatedUser.zohoCustomerId) {
        // 🆕 CREATE customer in Zoho
        const zohoCustomer = await createZohoCustomer(updatedUser);

        updatedUser.zohoCustomerId = zohoCustomer.contact_id;
        await updatedUser.save();

        console.log("Zoho customer CREATED:", zohoCustomer.contact_id);
      } else {
        // 🔄 UPDATE existing Zoho customer
        await updateZohoCustomer(
          updatedUser.zohoCustomerId,
          updatedUser
        );

        console.log("Zoho customer UPDATED:", updatedUser.zohoCustomerId);
      }
    } catch (zohoErr) {
      console.error(
        "Zoho sync failed:",
        zohoErr.response?.data || zohoErr.message
      );
      // ❗ Never block user update
    }

    /* -----------------------
       📧 Optional email
    ------------------------*/
    // await sendProfileUpdateMail(updatedUser);

    return res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: updatedUser
    });

  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error"
    });
  }
};

module.exports = { updateUserController, getUserController };
