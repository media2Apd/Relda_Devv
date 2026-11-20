
const AuthorizedBrandShop = require("../../models/authorizeBrandShop.js");
const {
  upload,
  deleteMultipleFromCloudinary
} = require("../../config/cloudinaryUpload.js");

// Multer middleware for admin document uploads
const uploadBrandShopFields = upload.fields([
  { name: "shopFrontPhoto", maxCount: 1 },
  { name: "shopInteriorPhotos", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "ownershipProof", maxCount: 1 }
]);

// Create Brand Shop - Website (Only 5 fields)
const create = async (req, res) => {
  try {
    const {
      proprietorName,
      email,
      mobile,
      city,
      state
    } = req.body;

    const newBrandShop = await AuthorizedBrandShop.create({
      proprietorName,
      email,
      mobile,
      city,
      state
    });

    return res.status(201).json({
      success: true,
      message: "Authorized brand shop application submitted successfully",
      data: newBrandShop
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating authorized brand shop",
      error: error.message
    });
  }
};

// Get all brand shops
const getAll = async (req, res) => {
  try {
    const brandShops = await AuthorizedBrandShop.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Authorized brand shops retrieved successfully",
      data: brandShops
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized brand shops",
      error: error.message
    });
  }
};

// Get brand shop by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const brandShop = await AuthorizedBrandShop.findById(id);

    if (!brandShop) {
      return res.status(404).json({
        success: false,
        message: "Authorized brand shop not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authorized brand shop retrieved successfully",
      data: brandShop
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized brand shop",
      error: error.message
    });
  }
};

// Update Brand Shop - Admin
const update = async (req, res) => {
  let uploadedPublicIds = [];

  try {
    const { id } = req.params;

    const existingBrandShop = await AuthorizedBrandShop.findById(id);

    if (!existingBrandShop) {
      return res.status(404).json({
        success: false,
        message: "Authorized brand shop not found"
      });
    }

    // Accept all admin-updatable fields
    const updateData = { ...req.body };

    let oldPublicIds = [];

    // Handle document uploads
    if (req.files && Object.keys(req.files).length > 0) {

      const documentSnapshot =
        existingBrandShop.documentSnapshot?.[0]?.toObject?.() ||
        existingBrandShop.documentSnapshot?.[0] ||
        {};

      for (const [fieldName, files] of Object.entries(req.files)) {
        if (files && files.length > 0) {
          const file = files[0];

          // Track previous file for deletion after successful update
          if (documentSnapshot[fieldName]?.publicId) {
            oldPublicIds.push(documentSnapshot[fieldName].publicId);
          }

          uploadedPublicIds.push(file.filename);

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype
          };
        }
      }

      updateData.documentSnapshot = [documentSnapshot];
    }

    // Update the same application using its ID
    const updated = await AuthorizedBrandShop.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      throw new Error("Unable to update authorized brand shop");
    }

    // Delete old Cloudinary files only after successful database update
    if (oldPublicIds.length > 0) {
      await deleteMultipleFromCloudinary(oldPublicIds);
    }

    return res.status(200).json({
      success: true,
      message: "Authorized brand shop updated successfully",
      data: updated
    });

  } catch (error) {

    // Clean up newly uploaded files if update fails
    if (uploadedPublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(uploadedPublicIds);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup error:", cleanupError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error updating authorized brand shop",
      error: error.message
    });
  }
};

// Delete Brand Shop
const deleteBrandShop = async (req, res) => {
  try {
    const { id } = req.params;

    const brandShop = await AuthorizedBrandShop.findById(id);

    if (!brandShop) {
      return res.status(404).json({
        success: false,
        message: "Authorized brand shop not found"
      });
    }

    // Collect Cloudinary public IDs
    const publicIds = [];

    if (brandShop.documentSnapshot?.length > 0) {
      const docs = brandShop.documentSnapshot[0];

      if (docs.shopFrontPhoto?.publicId) {
        publicIds.push(docs.shopFrontPhoto.publicId);
      }

      if (docs.shopInteriorPhotos?.publicId) {
        publicIds.push(docs.shopInteriorPhotos.publicId);
      }

      if (docs.gstCertificate?.publicId) {
        publicIds.push(docs.gstCertificate.publicId);
      }

      if (docs.ownershipProof?.publicId) {
        publicIds.push(docs.ownershipProof.publicId);
      }
    }

    await AuthorizedBrandShop.findByIdAndDelete(id);

    // Delete associated Cloudinary files
    if (publicIds.length > 0) {
      await deleteMultipleFromCloudinary(publicIds);
    }

    return res.status(200).json({
      success: true,
      message: "Authorized brand shop deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting authorized brand shop",
      error: error.message
    });
  }
};

module.exports = {
  uploadBrandShopFields,
  create,
  getAll,
  getById,
  update,
  deleteBrandShop
};
