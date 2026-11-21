
const AuthorizedBrandShop = require("../../models/authorizeBrandShop.js");

const {
  upload,
  deleteMultipleFromCloudinary,
} = require("../../config/cloudinaryUpload.js");

const sendApplicationNotification = require("../../utils/sendApplicationNotification.js");

// Multer middleware for admin document uploads
const uploadBrandShopFields = upload.fields([
  { name: "shopFrontPhoto", maxCount: 1 },
  { name: "shopInteriorPhotos", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "ownershipProof", maxCount: 1 },
]);

// Notification configuration
const APPLICATION_TYPE = "Authorized Brand Shop";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_EMAIL_2,
  process.env.ADMIN_EMAIL_3,
].filter(Boolean);

// Common notification helper
const notifyApplication = async (event, application) => {
  try {
    if (!application) {
      console.warn(
        `Brand Shop ${event} notification skipped: application missing`
      );
      return;
    }

    await sendApplicationNotification({
      event,
      customerEmail: application.email,
      customerName: application.proprietorName,
      applicationType: APPLICATION_TYPE,
      applicationId: application._id,
      rejectionReason: application.rejectionReason,
      adminEmails: ADMIN_EMAILS,
    });
  } catch (error) {
    console.error(
      `Brand Shop ${event} notification failed:`,
      error.message
    );
  }
};

// Create Brand Shop - Website
const create = async (req, res) => {
  try {
    const {
      proprietorName,
      email,
      mobile,
      city,
      state,
    } = req.body;

    const newBrandShop = await AuthorizedBrandShop.create({
      proprietorName,
      email,
      mobile,
      city,
      state,
    });

    // Customer + Admin notification
    await notifyApplication("SUBMITTED", newBrandShop);

    return res.status(201).json({
      success: true,
      message: "Authorized brand shop application submitted successfully",
      data: newBrandShop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating authorized brand shop",
      error: error.message,
    });
  }
};

// Get all brand shops
const getAll = async (req, res) => {
  try {
    const brandShops = await AuthorizedBrandShop.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Authorized brand shops retrieved successfully",
      data: brandShops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized brand shops",
      error: error.message,
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
        message: "Authorized brand shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authorized brand shop retrieved successfully",
      data: brandShop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized brand shop",
      error: error.message,
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
        message: "Authorized brand shop not found",
      });
    }

    const updateData = { ...req.body };

    // Status and rejection reason must be changed through updateStatus
    delete updateData.status;
    delete updateData.rejectionReason;

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

          if (documentSnapshot[fieldName]?.publicId) {
            oldPublicIds.push(documentSnapshot[fieldName].publicId);
          }

          uploadedPublicIds.push(file.filename);

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype,
          };
        }
      }

      updateData.documentSnapshot = [documentSnapshot];
    }

    const updated = await AuthorizedBrandShop.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new Error("Unable to update authorized brand shop");
    }

    // Delete old Cloudinary files after successful database update
    if (oldPublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(oldPublicIds);
      } catch (cleanupError) {
        console.error(
          "Old Cloudinary document cleanup failed:",
          cleanupError.message
        );
      }
    }

    // Admin notification only
    await notifyApplication("UPDATED", updated);

    return res.status(200).json({
      success: true,
      message: "Authorized brand shop updated successfully",
      data: updated,
    });
  } catch (error) {
    // Clean up newly uploaded files if update fails
    if (uploadedPublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(uploadedPublicIds);
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup error:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error updating authorized brand shop",
      error: error.message,
    });
  }
};

// Update Brand Shop Status - Admin
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const allowedStatuses = ["Pending", "Approved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand shop status",
      });
    }

    if (
      status === "Rejected" &&
      (!rejectionReason || !rejectionReason.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const existingBrandShop =
      await AuthorizedBrandShop.findById(id);

    if (!existingBrandShop) {
      return res.status(404).json({
        success: false,
        message: "Authorized brand shop not found",
      });
    }

    const previousStatus = existingBrandShop.status;

    existingBrandShop.status = status;

    if (status === "Rejected") {
      existingBrandShop.rejectionReason = rejectionReason.trim();
    } else if (status === "Approved") {
      existingBrandShop.rejectionReason = "";
    }

    await existingBrandShop.save();

    // Send email only when status actually changes
    if (previousStatus !== status) {
      if (status === "Approved") {
        await notifyApplication("APPROVED", existingBrandShop);
      } else if (status === "Rejected") {
        await notifyApplication("REJECTED", existingBrandShop);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Brand shop status updated successfully",
      data: existingBrandShop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating brand shop status",
      error: error.message,
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
        message: "Authorized brand shop not found",
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
      try {
        await deleteMultipleFromCloudinary(publicIds);
      } catch (cleanupError) {
        console.error(
          "Cloudinary document deletion failed:",
          cleanupError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Authorized brand shop deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting authorized brand shop",
      error: error.message,
    });
  }
};

module.exports = {
  uploadBrandShopFields,
  create,
  getAll,
  getById,
  update,
  updateStatus,
  deleteBrandShop,
};
