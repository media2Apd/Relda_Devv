const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');
const ParentCategory = require("../../models/parentCategoryModel");
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'parent_categories', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});

const upload = multer({ storage });

// Middleware to validate image dimensions
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

// ✅ Add Parent Category
// const addParentCategory = (req, res) => {
//   upload.single('categoryImage')(req, res, validateImageDimensions, async (err) => {
//     if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }

//     try {
//       const { name} = req.body;

//       if (!name || !req.file) {
//         return res.status(400).json({ success: false, message: "All fields are required, including an image." });
//       }

//       const imageUrl = req.file.path;

//       const parentCategory = new ParentCategory({
//         name,
//         // description,
//         categoryImage: imageUrl,
//       });

//       await parentCategory.save();
//       res.status(201).json({ success: true, message: "Parent Category added successfully.", parentCategory });
//     } catch (error) {
//       console.error("Error adding Parent Category:", error);
//       res.status(500).json({ success: false, message: "Internal server error." });
//     }
//   });
// };
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
// ✅ Get All Parent Categories
const getParentCategories = async (req, res) => {
  try {
    const categories = await ParentCategory.find();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching Parent Categories:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// ✅ Edit Parent Category
const editParentCategory = (req, res) => {
  upload.single('categoryImage')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updateData = { name, description };

      if (req.file) {
        const imageUrl = req.file.path;
        updateData.categoryImage = imageUrl;
      }

      const updatedCategory = await ParentCategory.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: "Parent Category not found." });
      }

      res.status(200).json({ success: true, message: "Parent Category updated successfully.", updatedCategory });
    } catch (error) {
      console.error("Error updating Parent Category:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });
};

// ✅ Delete Parent Category
const deleteParentCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await ParentCategory.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Parent Category not found." });
    }

    // Delete Image from Cloudinary
    const publicId = category.categoryImage.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`parent_categories/${publicId}`);

    await ParentCategory.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Parent Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting Parent Category:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  addParentCategory,
  getParentCategories,
  editParentCategory,
  deleteParentCategory,
};
