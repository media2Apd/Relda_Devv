const productModel = require("../../models/productModel")

const filterProductController = async (req, res) => {
    try {
      // Ensure category is an array or default to an empty array
      const categoryList = Array.isArray(req?.body?.category) ? req.body.category : [];
  
      if (!categoryList || categoryList.length === 0) {
        // If no categories are provided, return all products
        const products = await productModel.find({});
        return res.json({
          data: products,
          message: "All products returned",
          error: false,
          success: true,
        });
      }
  
      // Fetch products based on selected categories
      const products = await productModel.find({
        category: {
          "$in": categoryList,
        },
      });
  
      res.json({
        data: products,
        message: "Filtered products based on categories",
        error: false,
        success: true,
      });
    } catch (err) {
      console.error("Error filtering products:", err);
      res.json({
        message: err.message || err,
        error: true,
        success: false,
      });
    }
  };

module.exports = filterProductController

// const mongoose = require("mongoose");
// const productModel = require("../../models/productModel");

// const filterProductController = async (req, res) => {
//   try {
//     let categoryList = [];

//     // Accept category from query string (GET request)
//     const { category, parentCategory } = req.query;

//     if (category) {
//       if (Array.isArray(category)) {
//         categoryList = category;
//       } else {
//         categoryList = [category]; // wrap single value in array
//       }
//     }

//     const filter = {};

//     // Optional: Convert to ObjectId if your category is stored as ObjectId in MongoDB
//     if (categoryList.length > 0) {
//       filter.category = {
//         $in: categoryList.map((cat) => {
//           try {
//             return new mongoose.Types.ObjectId(cat);
//           } catch {
//             return cat;
//           }
//         }),
//       };
//     }

//     if (parentCategory) {
//       filter.parentCategory = parentCategory;
//     }

//     const products = await productModel.find(filter);

//     res.json({
//       data: products,
//       message: categoryList.length || parentCategory ? "Filtered products" : "All products",
//       error: false,
//       success: true,
//     });
//   } catch (err) {
//     console.error("Error filtering products:", err);
//     res.json({
//       message: err.message || err,
//       error: true,
//       success: false,
//     });
//   }
// };

// module.exports = filterProductController;
   