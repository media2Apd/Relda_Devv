const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinary');
const ProductCategory = require("../../models/productCategory");
// const cloudinary = require("../../utils/cloudinary");
const productModel = require("../../models/productModel")
const ParentCategory = require("../../models/parentCategoryModel");
const OfferPoster = require("../../models/offerPosterModel");
const redisClient = require("../../config/redisClient");
const { ALL_CATEGORIES_CACHE_KEY } = require("../../utils/constants");



const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'product_categories', 
    allowed_formats: ['jpg', 'jpeg', 'png'], 
  },
});

const upload = multer({ storage });

const getCategories = async (req, res) => {
  try {
    const { parentCategory } = req.query; // Get the parentCategory from query parameters
    let filter = {};

    // Check if categories are cached in Redis
    let cachedCategories = await redisClient.get(ALL_CATEGORIES_CACHE_KEY);

    if (cachedCategories) {
      console.log("Cache hit");
      const categories = JSON.parse(cachedCategories);

      // If a filter is applied, filter the cached categories
      if (parentCategory) {
        const filteredCategories = categories.filter(
          (category) => category.parentCategory?.name === parentCategory // Adjusted to check the name
        );
        return res.json({
          success: true,
          categories: filteredCategories,
        });
      }

      // If no filter is applied, return all cached categories
      return res.json({
        success: true,
        categories,
      });
    }

    // Fetch categories from DB if not cached
    const categories = await ProductCategory.find(filter)
      .populate('parentCategory', 'name');

    const offerPosters = await OfferPoster.find();

    const categoriesWithDetails = await Promise.all(
      categories.map(async (category) => {
        const productCount = await productModel.countDocuments({ category: category.value });

        const offerPoster = offerPosters.find(
          (poster) =>
            poster.parentCategory === category.parentCategory?.value ||
            poster.childCategory === category.value
        );

        return {
          ...category.toObject(),
          productCount,
          offerPoster: offerPoster
            ? {
                image: offerPoster.image,
                _id: offerPoster._id,
                createdAt: offerPoster.createdAt,
              }
            : null,
        };
      })
    );

    // Cache the result in Redis
    await redisClient.setEx(ALL_CATEGORIES_CACHE_KEY, 3600, JSON.stringify(categoriesWithDetails)); // Cache for 1 hour

    // Add HTTP cache headers
    // res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    res.status(200).json({ success: true, categories: categoriesWithDetails });
  } catch (error) {
    console.error("Error fetching categories or offer posters:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const addCategory = async (req, res) => {
  upload.single("categoryImage")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { label, value, parentCategory } = req.body;

      if (!label || !value || !req.file) {
        return res.status(400).json({ success: false, message: "All fields are required, including an image." });
      }

      // Check if parentCategory is an ID and fetch the ObjectId
      let parentCategoryId = null;
      if (parentCategory) {
        const parent = await ParentCategory.findById(parentCategory);
        if (parent) {
          parentCategoryId = parent._id;
        }
      }

      const imageUrl = req.file.path;

      const category = new ProductCategory({
        label,
        value,
        categoryImage: imageUrl,
        parentCategory: parentCategoryId || null, // Assign ObjectId or null
      });

      await category.save();
      await redisClient.del(ALL_CATEGORIES_CACHE_KEY); // Clear the cache after adding a new category
      res.status(201).json({ success: true, message: "Product Category added successfully.", category });
    } catch (error) {
      console.error("Error adding ProductCategory:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });
};
const editCategory = async (req, res) => {
  upload.single("categoryImage")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { id } = req.params;
      const { label, value, parentCategory } = req.body;
      const updateData = { label, value };
      if (parentCategory) {
        // Check if parentCategory is a name and fetch the ObjectId
        const parent = await ParentCategory.findById(parentCategory);
        if (parent) {
          updateData.parentCategory = parent._id;
        }
      }
      if (req.file) {
        updateData.categoryImage = req.file.path;
      }
      const updatedCategory = await ProductCategory.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedCategory) {
        return res.status(404).json({ success: false, message: "Category not found." });
      }
      await redisClient.del(ALL_CATEGORIES_CACHE_KEY);

      res.status(200).json({ success: true, message: "ProductCategory updated successfully.", updatedCategory });
    } catch (error) {
      console.error("Error updating ProductCategory:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  });
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ProductCategory.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    // Extract the Cloudinary public ID from URL
    const publicId = category.categoryImage.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`product_categories/${publicId}`);
    // Check if it's a parent category
    const subcategories = await ProductCategory.find({ parentCategory: id });
    if (subcategories.length > 0) {
      // Remove parent reference so subcategories become top-level categories
      await ProductCategory.updateMany({ parentCategory: id }, { parentCategory: null });
    }
    await ProductCategory.findByIdAndDelete(id);

    await redisClient.del(ALL_CATEGORIES_CACHE_KEY);
    res.status(200).json({ success: true, message: "ProductCategory deleted successfully." });
  } catch (error) {
    console.error("Error deleting ProductCategory:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
    addCategory,
    getCategories,
    editCategory,
    deleteCategory,
};