const ServiceCenter = require("../../models/authorizeServiceCenter.js");
const { upload, deleteMultipleFromCloudinary } = require("../../config/cloudinaryUpload.js");

// Multer middleware for service center fields
const uploadServiceCenterFields = upload.fields([
  { name: "serviceCenterPhotos", maxCount: 1 }
]);

// Create Service Center
const create = async (req, res) => {
  try {
    const data = req.body;
    
    // Handle file uploads
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
      
      data.documentSnapshot = [documentSnapshot];
    }

    // Parse JSON arrays if they come as strings
    if (data.productCategories && typeof data.productCategories === "string") {
      data.productCategories = JSON.parse(data.productCategories);
    }

    const newServiceCenter = new ServiceCenter(data);
    const saved = await newServiceCenter.save();
    
    res.status(201).json({
      success: true,
      message: "Service center created successfully",
      data: saved
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      const publicIds = Object.values(req.files)
        .flat()
        .filter(file => file.filename)
        .map(file => file.filename);
      await deleteMultipleFromCloudinary(publicIds);
    }
    
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
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingServiceCenter = await ServiceCenter.findById(id);
    if (!existingServiceCenter) {
      return res.status(404).json({
        success: false,
        message: "Service center not found"
      });
    }

    // Handle file uploads
    if (req.files) {
      const documentSnapshot = existingServiceCenter.documentSnapshot?.[0] || {};
      const oldPublicIds = [];
      
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
        }
      }
      
      if (oldPublicIds.length > 0) {
        await deleteMultipleFromCloudinary(oldPublicIds);
      }
      
      updateData.documentSnapshot = [documentSnapshot];
    }

    // Parse JSON arrays if they come as strings
    if (updateData.productCategories && typeof updateData.productCategories === "string") {
      updateData.productCategories = JSON.parse(updateData.productCategories);
    }

    const updated = await ServiceCenter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Service center updated successfully",
      data: updated
    });
  } catch (error) {
    // Clean up uploaded files if error occurs
    if (req.files) {
      const publicIds = Object.values(req.files)
        .flat()
        .filter(file => file.filename)
        .map(file => file.filename);
      await deleteMultipleFromCloudinary(publicIds);
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

    // Delete all associated files from Cloudinary
    if (serviceCenter.documentSnapshot && serviceCenter.documentSnapshot.length > 0) {
      const docs = serviceCenter.documentSnapshot[0];
      const publicIds = [];
      
      if (docs.serviceCenterPhotos?.publicId) publicIds.push(docs.serviceCenterPhotos.publicId);
      
      if (publicIds.length > 0) {
        await deleteMultipleFromCloudinary(publicIds);
      }
    }

    await ServiceCenter.findByIdAndDelete(id);
    
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