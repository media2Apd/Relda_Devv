const multer = require('multer');
const sharp = require('sharp');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'your-cloud-name',
  api_key: 'your-api-key',
  api_secret: 'your-api-secret',
});

// Use memoryStorage for Multer so we can access the file buffer
const storage = multer.memoryStorage();  // Storing file in memory

const upload = multer({ storage });

// Middleware to validate image dimensions (1600x520px)
const validateImageDimensions = (req, res, next) => {
  if (req.file) {
    // Use Sharp to get the image dimensions
    sharp(req.file.buffer)
      .metadata()
      .then(metadata => {
        const { width, height } = metadata;

        // Check if the image has the required dimensions (1600x520)
        if (width === 1600 && height === 520) {
          next(); // Proceed to the next middleware or route handler
        } else {
          return res.status(400).json({
            success: false,
            message: 'Image dimensions must be 1600x520px.',
          });
        }
      })
      .catch(err => {
        return res.status(400).json({
          success: false,
          message: 'Error processing the image.',
        });
      });
  } else {
    return res.status(400).json({
      success: false,
      message: 'No image uploaded.',
    });
  }
};

// Add Parent Category with image validation
const addParentCategory = (req, res) => {
  // Use multer and validate image dimensions before saving the category
  upload.single('categoryImage')(req, res, validateImageDimensions, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name } = req.body;

      if (!name || !req.file) {
        return res.status(400).json({ success: false, message: 'All fields are required, including an image.' });
      }

      // Now you can upload to Cloudinary
      const cloudinaryStorage = new CloudinaryStorage({
        cloudinary,
        params: {
          folder: 'parent_categories',
          allowed_formats: ['jpg', 'jpeg', 'png', 'svg'], // Allowed formats
        },
      });

      const cloudinaryUpload = multer({ storage: cloudinaryStorage }).single('categoryImage');
      
      cloudinaryUpload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ success: false, message: 'Failed to upload image to Cloudinary.' });
        }

        const imageUrl = req.file.path; // Cloudinary URL for the uploaded image

        const parentCategory = new ParentCategory({
          name,
          categoryImage: imageUrl,
        });

        await parentCategory.save();
        res.status(201).json({ success: true, message: 'Parent Category added successfully.', parentCategory });
      });
    } catch (error) {
      console.error('Error adding Parent Category:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
};

module.exports = { addParentCategory };
