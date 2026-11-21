
const authorizedDistributor = require("../../models/authorizeDistributor");

const {
  upload,
  deleteMultipleFromCloudinary,
} = require("../../config/cloudinaryUpload");

const sendApplicationNotification = require("../../utils/sendApplicationNotification");

// Multer middleware
const uploadCenterFields = upload.fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "shopPhoto", maxCount: 1 },
  { name: "warehousePhoto", maxCount: 1 },
  { name: "visitingCard", maxCount: 1 },
]);

exports.uploadCenterFields = uploadCenterFields;

// Notification configuration
const APPLICATION_TYPE = "Authorized Distributor";

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
        `Distributor ${event} notification skipped: application missing`
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
      `Distributor ${event} notification failed:`,
      error.message
    );
  }
};

// Create Distributor
exports.create = async (req, res) => {
  try {
    const {
      businessName,
      proprietorName,
      mobile,
      email,
      city,
      state,
    } = req.body;

    if (
      !businessName ||
      !proprietorName ||
      !mobile ||
      !email ||
      !city ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const data = {
      businessName,
      proprietorName,
      mobile,
      email,
      city,
      state,
    };

    if (req.files) {
      const documentSnapshot = {};

      for (const [fieldName, files] of Object.entries(req.files)) {
        if (files && files.length > 0) {
          const file = files[0];

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype,
          };
        }
      }

      if (Object.keys(documentSnapshot).length > 0) {
        data.documentSnapshot = [documentSnapshot];
      }
    }

    const saved = await new authorizedDistributor(data).save();

    // Customer + Admin notification
    await notifyApplication("SUBMITTED", saved);

    return res.status(201).json({
      success: true,
      message: "Authorized distributor created successfully",
      data: saved,
    });
  } catch (error) {
    if (req.files) {
      const publicIds = Object.values(req.files)
        .flat()
        .filter((file) => file.filename)
        .map((file) => file.filename);

      if (publicIds.length) {
        try {
          await deleteMultipleFromCloudinary(publicIds);
        } catch (cleanupError) {
          console.error(
            "Cloudinary cleanup error:",
            cleanupError.message
          );
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error creating authorized distributor",
      error: error.message,
    });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const distributors = await authorizedDistributor
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Authorized distributors retrieved successfully",
      data: distributors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized distributors",
      error: error.message,
    });
  }
};

// Get by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const distributor = await authorizedDistributor.findById(id);

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Authorized distributor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authorized distributor retrieved successfully",
      data: distributor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching authorized distributor",
      error: error.message,
    });
  }
};

// Update Distributor - Admin
exports.update = async (req, res) => {
  let newPublicIds = [];

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingDistributor =
      await authorizedDistributor.findById(id);

    if (!existingDistributor) {
      return res.status(404).json({
        success: false,
        message: "Authorized distributor not found",
      });
    }

    // Status changes must use the separate updateStatus API
    delete updateData.status;
    delete updateData.rejectionReason;

    if (
      updateData.productCategories &&
      typeof updateData.productCategories === "string"
    ) {
      updateData.productCategories = JSON.parse(
        updateData.productCategories
      );
    }

    const oldPublicIds = [];

    const documentSnapshot =
      existingDistributor.documentSnapshot?.[0]?.toObject
        ? existingDistributor.documentSnapshot[0].toObject()
        : {
            ...(existingDistributor.documentSnapshot?.[0] || {}),
          };

    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        if (files && files.length > 0) {
          const file = files[0];

          if (documentSnapshot[fieldName]?.publicId) {
            oldPublicIds.push(
              documentSnapshot[fieldName].publicId
            );
          }

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype,
          };

          newPublicIds.push(file.filename);
        }
      }

      updateData.documentSnapshot = [documentSnapshot];
    }

    const updated = await authorizedDistributor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new Error("Unable to update authorized distributor");
    }

    // Delete old files after successful update
    if (oldPublicIds.length) {
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
      message: "Authorized distributor updated successfully",
      data: updated,
    });
  } catch (error) {
    if (newPublicIds.length) {
      try {
        await deleteMultipleFromCloudinary(newPublicIds);
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup error:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error updating authorized distributor",
      error: error.message,
    });
  }
};

// Update Distributor Status - Admin
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid distributor status",
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

    const existingDistributor =
      await authorizedDistributor.findById(id);

    if (!existingDistributor) {
      return res.status(404).json({
        success: false,
        message: "Authorized distributor not found",
      });
    }

    const previousStatus = existingDistributor.status;

    existingDistributor.status = status;

    if (status === "Rejected") {
      existingDistributor.rejectionReason =
        rejectionReason.trim();
    } else if (status === "Approved") {
      existingDistributor.rejectionReason = "";
    }

    await existingDistributor.save();

    // Notify only when status actually changes
    if (previousStatus !== status) {
      if (status === "Approved") {
        await notifyApplication("APPROVED", existingDistributor);
      } else if (status === "Rejected") {
        await notifyApplication("REJECTED", existingDistributor);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Distributor status updated successfully",
      data: existingDistributor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating distributor status",
      error: error.message,
    });
  }
};

// Delete Distributor
exports.deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;

    const distributor = await authorizedDistributor.findById(id);

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Authorized distributor not found",
      });
    }

    const docs = distributor.documentSnapshot?.[0];
    const publicIds = [];

    if (docs) {
      if (docs.gstCertificate?.publicId) {
        publicIds.push(docs.gstCertificate.publicId);
      }

      if (docs.shopPhoto?.publicId) {
        publicIds.push(docs.shopPhoto.publicId);
      }

      if (docs.warehousePhoto?.publicId) {
        publicIds.push(docs.warehousePhoto.publicId);
      }

      if (docs.visitingCard?.publicId) {
        publicIds.push(docs.visitingCard.publicId);
      }
    }

    await authorizedDistributor.findByIdAndDelete(id);

    if (publicIds.length) {
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
      message: "Authorized distributor deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting authorized distributor",
      error: error.message,
    });
  }
};
