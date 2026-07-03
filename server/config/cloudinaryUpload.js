const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "relda/authorized-centers/documents",
    resource_type: "auto",
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  },
});

// Create multer instance
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});



// Helper function to delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Helper function to delete multiple files
const deleteMultipleFromCloudinary = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return;
  try {
    const promises = publicIds.map(id => deleteFromCloudinary(id));
    const results = await Promise.allSettled(promises);
    return results;
  } catch (error) {
    console.error("Error deleting multiple files:", error);
    throw error;
  }
};

module.exports={upload, deleteFromCloudinary, deleteMultipleFromCloudinary};