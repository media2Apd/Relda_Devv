
// const ServiceCenter = require("../../models/authorizeServiceCenter.js");
// const {
//   upload,
//   deleteMultipleFromCloudinary
// } = require("../../config/cloudinaryUpload.js");

// // Multer middleware
// const uploadServiceCenterFields = upload.fields([
//   { name: "serviceCenterPhotos", maxCount: 1 }
// ]);

// // Create Service Center
// const create = async (req, res) => {
//   try {
//     const {
//       serviceCenterName,
//       contactPerson,
//       mobile,
//       email,
//       city,
//       state
//     } = req.body;

//     if (
//       !serviceCenterName ||
//       !contactPerson ||
//       !mobile ||
//       !email ||
//       !city ||
//       !state
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Service center name, contact person, mobile, email, city and state are required"
//       });
//     }

//     const data = {
//       serviceCenterName,
//       contactPerson,
//       mobile,
//       email,
//       city,
//       state
//     };

//     const saved = await new ServiceCenter(data).save();

//     res.status(201).json({
//       success: true,
//       message: "Service center created successfully",
//       data: saved
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating service center",
//       error: error.message
//     });
//   }
// };

// // Get all service centers
// const getAll = async (req, res) => {
//   try {
//     const serviceCenters = await ServiceCenter.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Service centers retrieved successfully",
//       data: serviceCenters
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching service centers",
//       error: error.message
//     });
//   }
// };

// // Get service center by ID
// const getById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const serviceCenter = await ServiceCenter.findById(id);

//     if (!serviceCenter) {
//       return res.status(404).json({
//         success: false,
//         message: "Service center not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Service center retrieved successfully",
//       data: serviceCenter
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching service center",
//       error: error.message
//     });
//   }
// };

// // Update service center
// const update = async (req, res) => {
//   let newPublicIds = [];

//   try {
//     const { id } = req.params;
//     const updateData = { ...req.body };

//     const existingServiceCenter = await ServiceCenter.findById(id);

//     if (!existingServiceCenter) {
//       return res.status(404).json({
//         success: false,
//         message: "Service center not found"
//       });
//     }

//     // Parse productCategories
//     if (
//       updateData.productCategories &&
//       typeof updateData.productCategories === "string"
//     ) {
//       updateData.productCategories = JSON.parse(updateData.productCategories);
//     }

//     const oldPublicIds = [];

//     const documentSnapshot =
//       existingServiceCenter.documentSnapshot?.[0]?.toObject
//         ? existingServiceCenter.documentSnapshot[0].toObject()
//         : { ...(existingServiceCenter.documentSnapshot?.[0] || {}) };

//     // Handle file uploads
//     if (req.files) {
//       for (const [fieldName, files] of Object.entries(req.files)) {
//         if (files && files.length > 0) {
//           const file = files[0];

//           if (documentSnapshot[fieldName]?.publicId) {
//             oldPublicIds.push(documentSnapshot[fieldName].publicId);
//           }

//           documentSnapshot[fieldName] = {
//             url: file.path,
//             publicId: file.filename,
//             type: file.mimetype
//           };

//           newPublicIds.push(file.filename);
//         }
//       }

//       updateData.documentSnapshot = [documentSnapshot];
//     }

//     const updated = await ServiceCenter.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     // Delete old files only after successful database update
//     if (oldPublicIds.length > 0) {
//       await deleteMultipleFromCloudinary(oldPublicIds);
//     }

//     res.status(200).json({
//       success: true,
//       message: "Service center updated successfully",
//       data: updated
//     });

//   } catch (error) {
//     if (newPublicIds.length > 0) {
//       await deleteMultipleFromCloudinary(newPublicIds);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Error updating service center",
//       error: error.message
//     });
//   }
// };

// // Delete service center
// const deleteServiceCenter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const serviceCenter = await ServiceCenter.findById(id);

//     if (!serviceCenter) {
//       return res.status(404).json({
//         success: false,
//         message: "Service center not found"
//       });
//     }

//     const docs = serviceCenter.documentSnapshot?.[0];
//     const publicIds = [];

//     if (docs?.serviceCenterPhotos?.publicId) {
//       publicIds.push(docs.serviceCenterPhotos.publicId);
//     }

//     await ServiceCenter.findByIdAndDelete(id);

//     if (publicIds.length > 0) {
//       await deleteMultipleFromCloudinary(publicIds);
//     }

//     res.status(200).json({
//       success: true,
//       message: "Service center deleted successfully"
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error deleting service center",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   uploadServiceCenterFields,
//   create,
//   getAll,
//   getById,
//   update,
//   deleteServiceCenter
// };



const ServiceCenter = require("../../models/authorizeServiceCenter.js");
const {
  upload,
  deleteMultipleFromCloudinary,
} = require("../../config/cloudinaryUpload.js");
const sendApplicationNotification = require("../../utils/sendApplicationNotification.js");

// Application notification configuration
const APPLICATION_TYPE = "Authorized Service Center";

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  process.env.ADMIN_EMAIL_2,
  process.env.ADMIN_EMAIL_3,
].filter(Boolean);

// Reusable notification helper
const notifyApplication = async (event, application) => {
  try {
    if (!application) {
      console.warn(
        `Service Center ${event} notification skipped: application missing`
      );
      return;
    }

    await sendApplicationNotification({
      event,
      customerEmail: application.email,
      customerName: application.contactPerson,
      applicationType: APPLICATION_TYPE,
      applicationId: application._id,
      rejectionReason: application.rejectionReason,
      adminEmails: ADMIN_EMAILS,
    });
  } catch (error) {
    console.error(
      `Service Center ${event} notification failed:`,
      error.message
    );
  }
};

// Multer middleware
const uploadServiceCenterFields = upload.fields([
  { name: "serviceCenterPhotos", maxCount: 1 },
]);

// Create Service Center
const create = async (req, res) => {
  try {
    const {
      serviceCenterName,
      contactPerson,
      mobile,
      email,
      city,
      state,
    } = req.body;

    if (
      !serviceCenterName ||
      !contactPerson ||
      !mobile ||
      !email ||
      !city ||
      !state
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Service center name, contact person, mobile, email, city and state are required",
      });
    }

    const data = {
      serviceCenterName,
      contactPerson,
      mobile,
      email,
      city,
      state,
    };

    const saved = await new ServiceCenter(data).save();

    // Send submission email to customer and admins
    await notifyApplication("SUBMITTED", saved);

    return res.status(201).json({
      success: true,
      message: "Service center created successfully",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating service center",
      error: error.message,
    });
  }
};

// Get all service centers
const getAll = async (req, res) => {
  try {
    const serviceCenters = await ServiceCenter.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Service centers retrieved successfully",
      data: serviceCenters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching service centers",
      error: error.message,
    });
  }
};

// Get service center by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const serviceCenter = await ServiceCenter.findById(id);

    if (!serviceCenter) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service center retrieved successfully",
      data: serviceCenter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching service center",
      error: error.message,
    });
  }
};

// Update service center details
const update = async (req, res) => {
  let newPublicIds = [];
  let databaseUpdated = false;

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingServiceCenter = await ServiceCenter.findById(id);

    if (!existingServiceCenter) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    // Status and rejection reason must use the separate status API
    delete updateData.status;
    delete updateData.rejectionReason;

    // Parse productCategories
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
      existingServiceCenter.documentSnapshot?.[0]?.toObject
        ? existingServiceCenter.documentSnapshot[0].toObject()
        : { ...(existingServiceCenter.documentSnapshot?.[0] || {}) };

    // Handle file uploads
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

    const updated = await ServiceCenter.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    databaseUpdated = true;

    // Delete old files after successful database update
    if (oldPublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(oldPublicIds);
      } catch (cleanupError) {
        console.error(
          "Old Service Center Cloudinary cleanup failed:",
          cleanupError.message
        );
      }
    }

    // Send update email to admins only
    await notifyApplication("UPDATED", updated);

    return res.status(200).json({
      success: true,
      message: "Service center updated successfully",
      data: updated,
    });
  } catch (error) {
    // Clean up newly uploaded files only if database update did not succeed
    if (!databaseUpdated && newPublicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(newPublicIds);
      } catch (cleanupError) {
        console.error(
          "New Service Center Cloudinary cleanup failed:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Error updating service center",
      error: error.message,
    });
  }
};

// Update Service Center status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const allowedStatuses = ["Pending", "Approved", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service center status",
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

    const existingServiceCenter = await ServiceCenter.findById(id);

    if (!existingServiceCenter) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    const previousStatus = existingServiceCenter.status;

    existingServiceCenter.status = status;

    if (status === "Rejected") {
      existingServiceCenter.rejectionReason = rejectionReason.trim();
    } else if (status === "Approved") {
      existingServiceCenter.rejectionReason = "";
    }

    await existingServiceCenter.save();

    // Send notification only when the status actually changes
    if (previousStatus !== status) {
      if (status === "Approved") {
        await notifyApplication("APPROVED", existingServiceCenter);
      } else if (status === "Rejected") {
        await notifyApplication("REJECTED", existingServiceCenter);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Service center status updated successfully",
      data: existingServiceCenter,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating service center status",
      error: error.message,
    });
  }
};

// Delete service center
const deleteServiceCenter = async (req, res) => {
  try {
    const { id } = req.params;

    const serviceCenter = await ServiceCenter.findById(id);

    if (!serviceCenter) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    const docs = serviceCenter.documentSnapshot?.[0];
    const publicIds = [];

    if (docs?.serviceCenterPhotos?.publicId) {
      publicIds.push(docs.serviceCenterPhotos.publicId);
    }

    await ServiceCenter.findByIdAndDelete(id);

    if (publicIds.length > 0) {
      await deleteMultipleFromCloudinary(publicIds);
    }

    return res.status(200).json({
      success: true,
      message: "Service center deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting service center",
      error: error.message,
    });
  }
};

module.exports = {
  uploadServiceCenterFields,
  create,
  getAll,
  getById,
  update,
  updateStatus,
  deleteServiceCenter,
};
