// const productModel = require("../../models/productModel")
// const redisClient = require("../../config/redisClient");
// const { ALL_PRODUCTS_CACHE_KEY } = require("../../utils/constants");
// const getProductController = async (req, res) => {
//     try {
//         const { category } = req.query;

//         // Build the filter object dynamically
//         const filter = {};
//         if (category) {
//             filter.category = category.trim(); // Trim to remove extra spaces
//         }
//         let productsRecord = await redisClient.get(ALL_PRODUCTS_CACHE_KEY);
//         if (productsRecord) {
//             // If products are found in cache, return them
//             return res.json({
//                 message: "All Products (from cache)",
//                 success: true,
//                 error: false,
//                 data: JSON.parse(productsRecord),
//             });
//         }

//         // Fetch and sort products
//         const allProduct = await productModel.find(filter).sort({ createdAt: -1 });

//         await redisClient.setEx(ALL_PRODUCTS_CACHE_KEY, 3600, JSON.stringify(allProduct));


//         res.json({
//             message: "All Products",
//             success: true,
//             error: false,
//             data: allProduct,
//         });
//     } catch (err) {
//         res.status(400).json({
//             message: err.message || "An error occurred",
//             error: true,
//             success: false,
//         });
//     }
// };

// module.exports = getProductController;
const productModel = require("../../models/productModel");
const redisClient = require("../../config/redisClient");
const { ALL_PRODUCTS_CACHE_KEY } = require("../../utils/constants");

const getProductController = async (req, res) => {
    try {
        const { category } = req.query;

        // Check if the complete dataset is found in cache
        let productsRecord = await redisClient.get(ALL_PRODUCTS_CACHE_KEY);
        let allProducts;

        if (productsRecord) {
            // If products are found in cache, parse them
            allProducts = JSON.parse(productsRecord);
        } else {
            // Fetch all products from the database
            allProducts = await productModel.find().sort({ createdAt: -1 });

            // Store the complete dataset in cache
            await redisClient.setEx(ALL_PRODUCTS_CACHE_KEY, 3600, JSON.stringify(allProducts)); // Cache for 1 hour
        }

        // Apply filtering in memory
        let filteredProducts = allProducts;
        if (category) {
            filteredProducts = allProducts.filter(product => product.category === category.trim());
        }

        res.json({
            message: "Filtered Products",
            success: true,
            error: false,
            data: filteredProducts,
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "An error occurred",
            error: true,
            success: false,
        });
    }
};

module.exports = getProductController;