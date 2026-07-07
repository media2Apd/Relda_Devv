const AuthorizedBrandShop = require("../../models/authorizeBrandShop.js");
const { upload, deleteMultipleFromCloudinary } = require("../../config/cloudinaryUpload.js");

// Multer middleware for brand shop fields
const uploadBrandShopFields = upload.fields([
  { name: "shopFrontPhoto", maxCount: 1 },
  { name: "shopInteriorPhotos", maxCount: 1 },
  { name: "gstCertificate", maxCount: 1 },
  { name: "ownershipProof", maxCount: 1 }
]);

// Create Brand Shop
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

    const newBrandShop = new AuthorizedBrandShop(data);
    const saved = await newBrandShop.save();
    
    res.status(201).json({
      success: true,
      message: "Authorized brand shop created successfully",
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
      message: "Error creating authorized brand shop",
      error: error.message
    });
  }
};

// Get all brand shops
const getAll = async (req, res) => {
  try {
    const brandShops = await AuthorizedBrandShop.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: "Authorized brand shops retrieved successfully",
      data: brandShops
    });
  } catch (error) {
    res.status(500).json({
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
    
    res.status(200).json({
      success: true,
      message: "Authorized brand shop retrieved successfully",
      data: brandShop
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching authorized brand shop",
      error: error.message
    });
  }
};

// Update brand shop
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingBrandShop = await AuthorizedBrandShop.findById(id);
    if (!existingBrandShop) {
      return res.status(404).json({
        success: false,
        message: "Authorized brand shop not found"
      });
    }

    // Handle file uploads
    if (req.files) {
      const documentSnapshot = existingBrandShop.documentSnapshot?.[0] || {};
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

    const updated = await AuthorizedBrandShop.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Authorized brand shop updated successfully",
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
      message: "Error updating authorized brand shop",
      error: error.message
    });
  }
};

// Delete brand shop
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

    // Delete all associated files from Cloudinary
    if (brandShop.documentSnapshot && brandShop.documentSnapshot.length > 0) {
      const docs = brandShop.documentSnapshot[0];
      const publicIds = [];
      
      if (docs.shopFrontPhoto?.publicId) publicIds.push(docs.shopFrontPhoto.publicId);
      if (docs.shopInteriorPhotos?.publicId) publicIds.push(docs.shopInteriorPhotos.publicId);
      if (docs.gstCertificate?.publicId) publicIds.push(docs.gstCertificate.publicId);
      if (docs.ownershipProof?.publicId) publicIds.push(docs.ownershipProof.publicId);
      
      if (publicIds.length > 0) {
        await deleteMultipleFromCloudinary(publicIds);
      }
    }

    await AuthorizedBrandShop.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Authorized brand shop deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
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