
const authorizeDealer = require("../../models/authorizeDealer.js");

const {
  upload,
  deleteMultipleFromCloudinary,
} = require("../../config/cloudinaryUpload.js");

const sendApplicationNotification = require("../../utils/sendApplicationNotification.js");

// ============================================
// COMMON DEALER NOTIFICATION CONFIGURATION
// ============================================

const APPLICATION_TYPE = "Authorized Dealer";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_EMAIL_2,
  process.env.ADMIN_EMAIL_3,
].filter(Boolean);

// Common notification helper for Dealer
const notifyApplication = async (event, application) => {
  try {
    if (!application) {
      console.warn(`Dealer ${event} notification skipped: application missing`);
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
      `Dealer ${event} notification failed:`,
      error.message
    );
  }
};

// ============================================
// MULTER MIDDLEWARE
// ============================================

const uploadDealerFields = upload.fields([
  { name: "shopFrontPhoto", maxCount: 1 },
  { name: "shopInteriorPhoto", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "visitingCard", maxCount: 1 },
]);

// ============================================
// CREATE DEALER APPLICATION
// ============================================

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

    // Send customer and admin submission notifications
    await notifyApplication("SUBMITTED", newDealer);

    return res.status(201).json({
      success: true,
      message: "Dealer application submitted successfully",
      data: newDealer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating dealer application",
      error: error.message,
    });
  }
};

// ============================================
// GET ALL DEALERS
// ============================================

const getAll = async (req, res) => {
  try {
    const dealers = await authorizeDealer.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Dealers retrieved successfully",
      data: dealers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dealers",
      error: error.message,
    });
  }
};

// ============================================
// GET DEALER BY ID
// ============================================

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

    return res.status(200).json({
      success: true,
      message: "Dealer retrieved successfully",
      data: dealer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dealer",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE DEALER
// ============================================

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

      const updated = await authorizeDealer.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updated) {
        throw new Error("Dealer update failed");
      }

      // Delete replaced files after successful database update
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

      // Send update notification
      await notifyApplication("UPDATED", updated);

      return res.status(200).json({
        success: true,
        message: "Dealer updated successfully",
        data: updated,
      });
    }

    // Update only supplied fields
    const updated = await authorizeDealer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error("Dealer update failed");
    }

    // Send update notification
    await notifyApplication("UPDATED", updated);

    return res.status(200).json({
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

    return res.status(500).json({
      success: false,
      message: "Error updating dealer",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE DEALER STATUS
// ============================================


const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const allowedStatuses = ["Pending", "Approved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid dealer status",
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

    const existingDealer = await authorizeDealer.findById(id);

    if (!existingDealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found",
      });
    }

    const previousStatus = existingDealer.status;

    existingDealer.status = status;

    if (status === "Rejected") {
      existingDealer.rejectionReason = rejectionReason.trim();
    } else if (status === "Approved") {
      existingDealer.rejectionReason = "";
    }

    await existingDealer.save();

    if (previousStatus !== status) {
      if (status === "Approved") {
        await notifyApplication("APPROVED", existingDealer);
      } else if (status === "Rejected") {
        await notifyApplication("REJECTED", existingDealer);
      }
    } else if (
      status === "Rejected" &&
      previousStatus === "Rejected" &&
      existingDealer.isModified("rejectionReason")
    ) {
      // No additional status email when the rejection reason is unchanged.
      // If you want to notify admins and customer when the reason changes,
      // handle that as a separate event.
    }

    return res.status(200).json({
      success: true,
      message: "Dealer status updated successfully",
      data: existingDealer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating dealer status",
      error: error.message,
    });
  }
};


// ============================================
// DELETE DEALER
// ============================================

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

    return res.status(200).json({
      success: true,
      message: "Dealer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting dealer",
      error: error.message,
    });
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  uploadDealerFields,
  create,
  getAll,
  getById,
  update,
  updateStatus,
  deleteDealer,
};
