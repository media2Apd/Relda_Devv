const mongoose = require('mongoose');
const Product = require('../../models/productModel');

const getViewedProducts = async (req, res) => {
  try {
    // Step 1: Parse & validate the product IDs from query
    const rawIds = req.query.ids?.split(',').map(id => id.trim()).filter(id => /^[a-f\d]{24}$/i.test(id)) || [];

    if (rawIds.length === 0) {
      return res.status(400).json({ message: 'No valid product IDs provided' });
    }

    // Step 2: Fetch products by IDs
    const viewedProducts = await Product.find({ _id: { $in: rawIds } });

    if (viewedProducts.length === 0) {
      return res.status(404).json({ message: 'No products found for the provided IDs' });
    }

    // Step 3: Return them
    res.json(viewedProducts);
  } catch (err) {
    console.error('Error in getViewedProducts:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getViewedProducts };
