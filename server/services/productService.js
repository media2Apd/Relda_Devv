const productModel = require('../models/productModel');

// Function to fetch all products
const fetchProductsFromDB = async () => {
    try {
        const products = await productModel.find({});
        return products;
    } catch (error) {
        console.error("Error fetching products from DB:", error);
        throw error;
    }
};

// Function to fetch product by ID
const fetchProductById = async (productId) => {
    try {
        const product = await productModel.findById(productId);
        return product;
    } catch (error) {
        console.error("Error fetching product by ID from DB:", error);
        throw error;
    }
};

module.exports = {
    fetchProductsFromDB,
    fetchProductById
};