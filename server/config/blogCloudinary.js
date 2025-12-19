const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");
const cloudinary = require("./cloudinary"); 

const blogImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_images',
        format: async (req, file) => 'jpeg', // Convert all to JPEG
        public_id: (req, file) => file.fieldname + '-' + Date.now(),
        resource_type: "image", // Ensure only images are uploaded
      },
});

const blogImageUpload = multer({ storage: blogImageStorage });

module.exports =  blogImageUpload;