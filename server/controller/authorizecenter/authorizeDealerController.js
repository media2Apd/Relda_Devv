const authorizeDealer = require("../../models/authorizeDealer.js");
const { upload, deleteMultipleFromCloudinary } = require("../../config/cloudinaryUpload.js");

// Multer middleware for dealer fields
const uploadDealerFields = upload.fields([
  { name: "shopFrontPhoto", maxCount: 1 },
  { name: "shopInteriorPhoto", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "visitingCard", maxCount: 1 }
]);

// Create Dealer
const create = async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    console.log(req.files)
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
    if (data.interestedCategories && typeof data.interestedCategories === "string") {
      data.interestedCategories = JSON.parse(data.interestedCategories);
    }

    const newDealer = new authorizeDealer(data);
    const saved = await newDealer.save();
    
    res.status(201).json({
      success: true,
      message: "Dealer created successfully",
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
      message: "Error creating dealer",
      error: error.message
    });
  }
};

// Get all dealers
const getAll = async (req, res) => {
  try {
    const dealers = await authorizeDealer.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: "Dealers retrieved successfully",
      data: dealers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealers",
      error: error.message
    });
  }
};

// Get dealer by ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const dealer = await authorizeDealer.findById(id);
    
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Dealer retrieved successfully",
      data: dealer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dealer",
      error: error.message
    });
  }
};

// Update dealer
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingDealer = await authorizeDealer.findById(id);
    if (!existingDealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Handle file uploads
    if (req.files) {
      const documentSnapshot = existingDealer.documentSnapshot?.[0] || {};
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
    if (updateData.interestedCategories && typeof updateData.interestedCategories === "string") {
      updateData.interestedCategories = JSON.parse(updateData.interestedCategories);
    }

    const updated = await authorizeDealer.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Dealer updated successfully",
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
      message: "Error updating dealer",
      error: error.message
    });
  }
};

// Delete dealer
const deleteDealer = async (req, res) => {
  try {
    const { id } = req.params;
    
    const dealer = await authorizeDealer.findById(id);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: "Dealer not found"
      });
    }

    // Delete all associated files from Cloudinary
    if (dealer.documentSnapshot && dealer.documentSnapshot.length > 0) {
      const docs = dealer.documentSnapshot[0];
      const publicIds = [];
      
      if (docs.shopFrontPhoto?.publicId) publicIds.push(docs.shopFrontPhoto.publicId);
      if (docs.shopInteriorPhoto?.publicId) publicIds.push(docs.shopInteriorPhoto.publicId);
      if (docs.gstCertificate?.publicId) publicIds.push(docs.gstCertificate.publicId);
      if (docs.visitingCard?.publicId) publicIds.push(docs.visitingCard.publicId);
      
      if (publicIds.length > 0) {
        await deleteMultipleFromCloudinary(publicIds);
      }
    }

    await authorizeDealer.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Dealer deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting dealer",
      error: error.message
    });
  }
};

module.exports = {
  uploadDealerFields,
  create,
  getAll,
  getById,
  update,
  deleteDealer
};