const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Controller to handle submitting a review
exports.submitReview = async (req, res) => {
    try {
      // You already have req.userId from the middleware
      const { productId, rating, review } = req.body;
      const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

      // Create a new review using the userId
      const newReview = new Review({
        productId,
        user: req.userId,  // Directly use the userId
        rating,
        review,
    });
    await newReview.save();

      // Save the review
      await newReview.save();

      return res.status(200).json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
};

// Controller to fetch reviews for a specific product
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.query;

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Fetch reviews for the product
    const reviews = await Review.find({ productId })
      .populate('user', 'name _id address.city')  // Populate user with name, _id, and address.city
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log(reviews);

    // Send the reviews with populated user details
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};



