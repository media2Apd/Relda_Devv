
const authorizeDealer = require("../../models/authorizeDealer.js");
const {
  upload,
  deleteMultipleFromCloudinary,
} = require("../../config/cloudinaryUpload.js");

// Multer middleware for admin document uploads
const uploadDealerFields = upload.fields([
  { name: "shopFrontPhoto", maxCount: 1 },
  { name: "shopInteriorPhoto", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "visitingCard", maxCount: 1 },
]);

// CREATE DEALER APPLICATION
// Website submits only 5 fields
const create = async (req, res) => {
  try {
    const { proprietorName, email, mobile, city, state } = req.body;

    const newDealer = await authorizeDealer.create({
      proprietorName,
      email,
      mobile,
      city,
      state,
    });

    res.status(201).json({
      success: true,
      message: "Dealer application submitted successfully",
      data: newDealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating dealer application",
      error: error.message,
    });
  }
};

// GET ALL DEALERS
const getAll = async (req, res) => {
  try {
    const dealers = await authorizeDealer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Dealers retrieved successfully",
      data: dealers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealers",
      error: error.message,
    });
  }
};

// GET DEALER BY ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await authorizeDealer.findById(id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dealer retrieved successfully",
      data: dealer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealer",
      error: error.message,
    });
  }
};

// UPDATE DEALER
// Admin can update all business details
const update = async (req, res) => {
  let uploadedPublicIds = [];

  try {
    const { id } = req.params;

    const existingDealer = await authorizeDealer.findById(id);

    if (!existingDealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    const updateData = { ...req.body };

    // Parse array fields if sent as JSON strings
    ["productCategories", "interestedCategories"].forEach((field) => {
      if (typeof updateData[field] === "string") {
        updateData[field] = JSON.parse(updateData[field]);
      }
    });

    // Handle admin document uploads
    if (req.files && Object.keys(req.files).length > 0) {
      const documentSnapshot =
        existingDealer.documentSnapshot?.[0]?.toObject?.() ||
        existingDealer.documentSnapshot?.[0] ||
        {};

      const oldPublicIds = [];

      for (const [fieldName, files] of Object.entries(req.files)) {
        if (files && files.length > 0) {
          const file = files[0];

          uploadedPublicIds.push(file.filename);

          if (documentSnapshot[fieldName]?.publicId) {
            oldPublicIds.push(documentSnapshot[fieldName].publicId);
          }

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype,
          };
        }
      }

      updateData.documentSnapshot = [documentSnapshot];

      // Delete replaced files after successful database update
      const updated = await authorizeDealer.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        throw new Error("Dealer update failed");
      }

      if (oldPublicIds.length > 0) {
        await deleteMultipleFromCloudinary(oldPublicIds);
      }

      return res.status(200).json({
        success: true,
        message: "Dealer updated successfully",
        data: updated,
      });
    }

    // Update only supplied fields.
    // Existing values are preserved when fields are omitted.
    const updated = await authorizeDealer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Dealer updated successfully",
      data: updated,
    });
  } catch (error) {
    // Remove newly uploaded files if update fails
    if (uploadedPublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(uploadedPublicIds);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup error:", cleanupError.message);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating dealer",
      error: error.message,
    });
  }
};

// DELETE DEALER
const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;

    const dealer = await authorizeDealer.findById(id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    // Collect all Cloudinary document IDs
    const publicIds = [];

    if (dealer.documentSnapshot?.length > 0) {
      const docs = dealer.documentSnapshot[0];

      [
        "shopFrontPhoto",
        "shopInteriorPhoto",
        "gstCertificate",
        "visitingCard",
      ].forEach((field) => {
        if (docs[field]?.publicId) {
          publicIds.push(docs[field].publicId);
        }
      });
    }

    await authorizeDealer.findByIdAndDelete(id);

    if (publicIds.length > 0) {
      await deleteMultipleFromCloudinary(publicIds);
    }

    res.status(200).json({
      success: true,
      message: "Dealer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting dealer",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDealerFields,
  create,
  getAll,
  getById,
  update,
  deleteDealer,
};
