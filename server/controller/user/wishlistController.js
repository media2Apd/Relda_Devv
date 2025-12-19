const User = require('../../models/userModel');
const Product = require('../../models/productModel');
const mongoose = require('mongoose');
// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
      res.status(200).json({ message: 'Product added to wishlist' });
    } else {
      res.status(400).json({ message: 'Product already in wishlist' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const user = await User.findById(userId);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  // Validate user ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    // Find user and populate the wishlist
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the populated wishlist
    res.status(200).json({
      success: true,
      message: 'Wishlist retrieved successfully',
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};