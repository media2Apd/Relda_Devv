const { cloudinary } = require('../../config/cloudinary');
const fs = require('fs');
const path = require('path');
const OfferPoster = require('../../models/offerPosterModel');
const { log } = require('console');
const redisClient = require("../../config/redisClient");
const { ALL_CATEGORIES_CACHE_KEY } = require("../../utils/constants");
const Category = require("../../models/parentCategoryModel");

// ✅ Add Offer Poster
// ✅ Add Offer Poster
exports.addOfferPoster = async (req, res) => {
    try {
        // Log the request body and file to see the data you're receiving
        console.log("Request Body:", JSON.stringify(req.body, null, 2));  // Logs the body properly
        console.log("Uploaded File Path:", req.file ? req.file.path : "No file uploaded");  // Logs the file path

        const { parentCategory, childCategory } = req.body;
        const image = req.file ? req.file.path : null;

        if (!parentCategory || !childCategory || !image) {
            return res.status(400).json({ message: "All fields are required, including an image." });
        }

        const offerPoster = new OfferPoster({
            parentCategory,
            childCategory,
            image,
        });

        await offerPoster.save();
        await redisClient.del(ALL_CATEGORIES_CACHE_KEY); // Invalidate the cache after adding a new offer poster
        res.status(201).json({ message: "Offer Poster added successfully.", offerPoster });
    }
    catch (error) {
        console.error("Error adding Offer Poster:", error); // Log detailed error message
        res.status(500).json({ message: "Internal server error.", error: error.message }); // Send detailed error response
    }
};


// ✅ Get All Offer Posters
// exports.getAllOfferPosters = async (req, res) => {
//     try {
//         const offerPosters = await OfferPoster.find().populate('parentCategory').populate('childCategory');
//         res.status(200).json({ offerPosters });
//     }
//     catch (error) {
//         console.error("Error fetching Offer Posters:", error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

exports.getAllOfferPosters = async (req, res) => {
    try {
        const { parentCategoryName, childCategory } = req.query;
        const filter = {};
        if (parentCategoryName) {
            const parentCategory = await Category.findOne({ name: parentCategoryName });
            if (parentCategory) {
                filter.parentCategory = parentCategory._id;
            } else {
                return res.status(404).json({ message: "Parent category not found." });
            }
        }
        if (childCategory) filter.childCategory = childCategory;

        const offerPosters = await OfferPoster.find(filter)
            .populate('parentCategory')
            .populate('childCategory');

        res.status(200).json({ offerPosters });
    }
    catch (error) {
        console.error("Error fetching Offer Posters:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// ✅ Edit Offer Poster
exports.editOfferPoster = async (req, res) => {
    try {
        const { id } = req.params;
        const { parentCategory, childCategory } = req.body;

        const updateData = { parentCategory, childCategory };

        if (req.file) {
            const imageUrl = req.file.path;
            updateData.image = imageUrl;
        }

        const offerPoster = await OfferPoster.findByIdAndUpdate(id, updateData, { new: true });
        await redisClient.del(ALL_CATEGORIES_CACHE_KEY); // Invalidate the cache after updating an offer poster
        res.status(200).json({ message: "Offer Poster updated successfully.", offerPoster });
    }
    catch (error) {
        console.error("Error updating Offer Poster:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


// ✅ Delete Offer Poster
exports.deleteOfferPoster = async (req, res) => {
    try {
        const { id } = req.params;
        const offerPosterToDelete = await OfferPoster.findById(id); // Renamed variable to avoid conflict

        if (!offerPosterToDelete) {
            return res.status(404).json({ message: "Offer Poster not found." });
        }

        await OfferPoster.findByIdAndDelete(id);
        await redisClient.del(ALL_CATEGORIES_CACHE_KEY); // Invalidate the cache after deleting an offer poster
        res.status(200).json({ message: "Offer Poster deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting Offer Poster:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


// ✅ Get Offer Poster by ID
exports.getOfferPosterById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetchhing offer poster with ID:", id);

        const offerPoster = await OfferPoster.findById(id);
        if (!offerPoster) {
            return res.status(404).json({ message: "Offer Poster not found." });
        }
        res.status(200).json({ offerPoster });
    }
    catch (error) {
        console.error("Error fetching Offer Poster:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
 