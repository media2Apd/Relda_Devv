
const ServiceCenter = require("../../models/authorizeServiceCenter.js");
const {
  upload,
  deleteMultipleFromCloudinary
} = require("../../config/cloudinaryUpload.js");

// Multer middleware
const uploadServiceCenterFields = upload.fields([
  { name: "serviceCenterPhotos", maxCount: 1 }
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
      state
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
        message: "Service center name, contact person, mobile, email, city and state are required"
      });
    }

    const data = {
      serviceCenterName,
      contactPerson,
      mobile,
      email,
      city,
      state
    };

    const saved = await new ServiceCenter(data).save();

    res.status(201).json({
      success: true,
      message: "Service center created successfully",
      data: saved
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating service center",
      error: error.message
    });
  }
};

// Get all service centers
const getAll = async (req, res) => {
  try {
    const serviceCenters = await ServiceCenter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Service centers retrieved successfully",
      data: serviceCenters
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching service centers",
      error: error.message
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
        message: "Service center not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Service center retrieved successfully",
      data: serviceCenter
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching service center",
      error: error.message
    });
  }
};

// Update service center
const update = async (req, res) => {
  let newPublicIds = [];

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingServiceCenter = await ServiceCenter.findById(id);

    if (!existingServiceCenter) {
      return res.status(404).json({
        success: false,
        message: "Service center not found"
      });
    }

    // Parse productCategories
    if (
      updateData.productCategories &&
      typeof updateData.productCategories === "string"
    ) {
      updateData.productCategories = JSON.parse(updateData.productCategories);
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
            oldPublicIds.push(documentSnapshot[fieldName].publicId);
          }

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype
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

    // Delete old files only after successful database update
    if (oldPublicIds.length > 0) {
      await deleteMultipleFromCloudinary(oldPublicIds);
    }

    res.status(200).json({
      success: true,
      message: "Service center updated successfully",
      data: updated
    });

  } catch (error) {
    if (newPublicIds.length > 0) {
      await deleteMultipleFromCloudinary(newPublicIds);
    }

    res.status(500).json({
      success: false,
      message: "Error updating service center",
      error: error.message
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
        message: "Service center not found"
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

    res.status(200).json({
      success: true,
      message: "Service center deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting service center",
      error: error.message
    });
  }
};

module.exports = {
  uploadServiceCenterFields,
  create,
  getAll,
  getById,
  update,
  deleteServiceCenter
};
