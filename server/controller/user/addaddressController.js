const mongoose = require('mongoose');

const userModel = require("../../models/userModel");
const { updateZohoCustomer } = require("../../services/zohoCustomer.service");
const getAllAddresses = async (req, res) => {
  try {
    const { userId } = req; // Authenticated user's ID

    const user = await userModel.findById(userId, "addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
// const addAddress = async (req, res) => {
//   const { street,  city, state, country, pinCode, default: isDefault } = req.body;

//   try {
//     // Validate required fields
//     if (!street || !city || !state || !country || !pinCode) {
//       return res.status(400).json({ message: "All required fields must be provided" });
//     }

//     // Find the user by ID (from token)
//     const user = await userModel.findById(req.userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Initialize the addresses array if not present
//     if (!user.addresses) {
//       user.addresses = [];
//     }

//     // Handle the default address logic
//     if (isDefault) {
//       // Make all other addresses non-default
//       user.addresses.forEach((address) => {
//         address.default = false;
//       });
//     }

//     // Create the new address with an auto-generated _id (using Mongoose's ObjectId)
//     const newAddress = {
//       _id: new mongoose.Types.ObjectId(), // Generate a unique ID for the address
//       street,
//       city,
//       state,
//       country,
//       pinCode,
//       default: isDefault || false, // Default to false if not provided
//     };

//     // Push the new address into the user's address array
//     user.addresses.push(newAddress);

//     // Save the updated user document with the new address
//     await user.save(); // This ensures that the user's document (including addresses) is saved in the database

//     // Return the updated addresses array including the new address with its _id
//     res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
//   } catch (error) {
//     console.error("Error adding address:", error);
//     res.status(500).json({ message: "Error adding address", error });
//   }
// };
const addAddress = async (req, res) => {
  const { street, city, state, country, pinCode, default: isDefault } = req.body;

  try {
    /* --------------------
       Validation
    -------------------- */
    if (!street || !city || !state || !country || !pinCode) {
      return res.status(400).json({
        success: false,
        message: "Street, city, state, country and pincode are required"
      });
    }

    /* --------------------
       Fetch user
    -------------------- */
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.addresses) user.addresses = [];

    /* --------------------
       Default logic
    -------------------- */
    const makeDefault =
      isDefault === true || user.addresses.length === 0;

    if (makeDefault) {
      user.addresses.forEach(addr => {
        addr.default = false;
      });
    }

    /* --------------------
       Create address
    -------------------- */
    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      street,
      city,
      state,
      country,
      pinCode,
      default: makeDefault
    };

    user.addresses.push(newAddress);

    /* --------------------
       Sync single address
       (VERY IMPORTANT)
    -------------------- */
    if (makeDefault) {
      user.address = newAddress;
    }

    await user.save();

    /* --------------------
       🔥 ZOHO ADDRESS UPDATE
    -------------------- */
    if (makeDefault && user.zohoCustomerId) {
      try {
        await updateZohoCustomer(user.zohoCustomerId, user);
        console.log("Zoho customer address updated");
      } catch (zohoErr) {
        console.error(
          "Zoho update failed:",
          zohoErr.response?.data || zohoErr.message
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses,
      defaultAddress: user.address
    });

  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding address"
    });
  }
};







// const updateAddress = async (req, res) => {
//   try {
//     const { userId } = req; // Authenticated user's ID
//     const { addressId } = req.params; // Address ID from URL params
//     const { street, addressLine2, city, state, country, pinCode, default: isDefault } = req.body;

//     // Validate userId and addressId
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is missing" });
//     }

//     if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
//       return res.status(400).json({ message: "Invalid or missing address ID" });
//     }

//     // Find the user
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Ensure addresses array exists
//     if (!user.addresses || !Array.isArray(user.addresses)) {
//       return res.status(404).json({ message: "No addresses found for the user" });
//     }

//     // Find the address to update
//     const address = user.addresses.id(addressId);
//     if (!address) {
//       return res.status(404).json({ message: "Address not found" });
//     }

//     // If updating to default, reset all other default flags
//     if (isDefault) {
//       user.addresses.forEach(addr => (addr.default = false));
//     }

//     // Update the fields
//     // address.addressLine1 = addressLine1 || address.addressLine1;
//     address.street = street || address.street;
//     address.city = city || address.city;
//     address.state = state || address.state;
//     address.country = country || address.country;
//     address.pinCode = pinCode || address.pinCode;
//     address.default = isDefault !== undefined ? isDefault : address.default;

//     // Save the updated user document
//     await user.save();

//     // Return the updated address
//     res.status(200).json({ message: "Address updated successfully", address });
//   } catch (error) {
//     console.error("Error updating address:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
const updateAddress = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { addressId } = req.params;
    const { street, city, state, country, pinCode, default: isDefault } = req.body;

    /* --------------------
       Basic validation
    -------------------- */
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid or missing address ID" });
    }

    /* --------------------
       Fetch user
    -------------------- */
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.addresses || user.addresses.length === 0) {
      return res.status(404).json({ message: "No addresses found for the user" });
    }

    /* --------------------
       Find address
    -------------------- */
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    /* --------------------
       Default logic
    -------------------- */
    const wasDefault = address.default === true;

    if (isDefault === true) {
      // Reset all others
      user.addresses.forEach(addr => (addr.default = false));
      address.default = true;
    } else if (isDefault === false && wasDefault) {
      // Prevent user having NO default address
      return res.status(400).json({
        message: "At least one address must be default"
      });
    }

    /* --------------------
       Update fields (safe)
    -------------------- */
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (country !== undefined) address.country = country;
    if (pinCode !== undefined) address.pinCode = pinCode;

    /* --------------------
       Sync single default address
    -------------------- */
    if (address.default === true) {
      user.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        pinCode: address.pinCode,
        default: true
      };
    }

    await user.save();

    /* --------------------
       🔥 ZOHO UPDATE
    -------------------- */
    if (address.default === true && user.zohoCustomerId) {
      try {
        await updateZohoCustomer(user.zohoCustomerId, user);
        console.log("Zoho customer address updated");
      } catch (zohoErr) {
        console.error(
          "Zoho update failed:",
          zohoErr.response?.data || zohoErr.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
      defaultAddress: user.address
    });

  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};





const deleteAddress = async (req, res) => {
  try {
    const { userId } = req; // Authenticated user's ID
    const { addressId } = req.params; // Address ID from URL params

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address by its ID in the user's address array
    const addressIndex = user.addresses.findIndex(address => address._id.toString() === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Remove the address from the addresses array
    user.addresses.splice(addressIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params; // Address ID to be set as default
  const { userId } = req; // Authenticated user's ID

  try {
    // Check if the provided address ID is valid
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the address to be set as default
    const addressToSetDefault = user.addresses.id(addressId);
    if (!addressToSetDefault) {
      return res.status(404).json({ message: "Address not found or does not belong to the user" });
    }

    // If the selected address is already the default, no further action is needed
    if (addressToSetDefault.default) {
      return res.status(200).json({ message: "This address is already the default address" });
    }

    // Reset all addresses to non-default
    user.addresses.forEach(addr => addr.default = false);

    // Set the selected address as default
    addressToSetDefault.default = true;

    // Also update the user's address field to reflect the new default address
    user.address = addressToSetDefault;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Default address updated successfully",
      updatedAddress: addressToSetDefault,
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({
      message: "An error occurred while setting the default address",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};