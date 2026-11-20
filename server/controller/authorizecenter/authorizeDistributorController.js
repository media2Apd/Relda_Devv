
const authorizedDistributor = require("../../models/authorizeDistributor");
const {
  upload,
  deleteMultipleFromCloudinary
} = require("../../config/cloudinaryUpload");

// Multer middleware
const uploadCenterFields = upload.fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "shopPhoto", maxCount: 1 },
  { name: "warehousePhoto", maxCount: 1 },
  { name: "visitingCard", maxCount: 1 }
]);

exports.uploadCenterFields = uploadCenterFields;

// Create
exports.create = async (req, res) => {
  try {
    const {
  businessName,
  proprietorName,
  mobile,
  email,
  city,
  state
} = req.body;

if (!businessName || !proprietorName || !mobile || !email || !city || !state) {
  return res.status(400).json({
    success: false,
    message: "All required fields must be provided"
  });
}

const data = {
  businessName,
  proprietorName,
  mobile,
  email,
  city,
  state
};

    if (req.files) {
      const documentSnapshot = {};

      for (const [fieldName, files] of Object.entries(req.files)) {
        if (files && files.length > 0) {
          const file = files[0];

          documentSnapshot[fieldName] = {
            url: file.path,
            publicId: file.filename,
            type: file.mimetype
          };
        }
      }

      if (Object.keys(documentSnapshot).length > 0) {
        data.documentSnapshot = [documentSnapshot];
      }
    }

    const saved = await new authorizedDistributor(data).save();

    res.status(201).json({
      success: true,
      message: "Authorized distributor created successfully",
      data: saved
    });

  } catch (error) {
    if (req.files) {
      const publicIds = Object.values(req.files)
        .flat()
        .filter(file => file.filename)
        .map(file => file.filename);

      if (publicIds.length) {
        await deleteMultipleFromCloudinary(publicIds);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error creating authorized distributor",
      error: error.message
    });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const distributors = await authorizedDistributor
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Authorized distributors retrieved successfully",
      data: distributors
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching authorized distributors",
      error: error.message
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
        message: "Authorized distributor not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Authorized distributor retrieved successfully",
      data: distributor
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching authorized distributor",
      error: error.message
    });
  }
};

// Update
exports.update = async (req, res) => {
  let newPublicIds = [];

  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const existingDistributor = await authorizedDistributor.findById(id);

    if (!existingDistributor) {
      return res.status(404).json({
        success: false,
        message: "Authorized distributor not found"
      });
    }

    if (updateData.productCategories && typeof updateData.productCategories === "string") {
      updateData.productCategories = JSON.parse(updateData.productCategories);
    }

    const oldPublicIds = [];
    const documentSnapshot = existingDistributor.documentSnapshot?.[0]?.toObject
      ? existingDistributor.documentSnapshot[0].toObject()
      : { ...(existingDistributor.documentSnapshot?.[0] || {}) };

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

    const updated = await authorizedDistributor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (oldPublicIds.length) {
      await deleteMultipleFromCloudinary(oldPublicIds);
    }

    res.status(200).json({
      success: true,
      message: "Authorized distributor updated successfully",
      data: updated
    });

  } catch (error) {
    if (newPublicIds.length) {
      await deleteMultipleFromCloudinary(newPublicIds);
    }

    res.status(500).json({
      success: false,
      message: "Error updating authorized distributor",
      error: error.message
    });
  }
};

// Delete
exports.deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;

    const distributor = await authorizedDistributor.findById(id);

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Authorized distributor not found"
      });
    }

    const docs = distributor.documentSnapshot?.[0];
    const publicIds = [];

    if (docs) {
      if (docs.gstCertificate?.publicId) publicIds.push(docs.gstCertificate.publicId);
      if (docs.shopPhoto?.publicId) publicIds.push(docs.shopPhoto.publicId);
      if (docs.warehousePhoto?.publicId) publicIds.push(docs.warehousePhoto.publicId);
      if (docs.visitingCard?.publicId) publicIds.push(docs.visitingCard.publicId);
    }

    await authorizedDistributor.findByIdAndDelete(id);

    if (publicIds.length) {
      await deleteMultipleFromCloudinary(publicIds);
    }

    res.status(200).json({
      success: true,
      message: "Authorized distributor deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting authorized distributor",
      error: error.message
    });
  }
};
