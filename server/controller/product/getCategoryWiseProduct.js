const productModel = require("../../models/productModel");
const ProductCategory = require("../../models/productCategory");

// const getCategoryWiseProduct = async(req,res)=>{
//     try{
//         const { category } = req?.body || req?.query
//         const product = await productModel.find({ category })

//         res.json({
//             data : product,
//             message : "Product",
//             success : true,
//             error : false
//         })
//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = getCategoryWiseProduct

const getCategoryWiseProduct = async (req, res) => {
  try {
    let categoryValue = req.body || req.query;

    // 🔥 FIX: if category is object, extract value
    if (typeof categoryValue === "object" && categoryValue !== null) {
      categoryValue = categoryValue.category;
    }

    if (!categoryValue || typeof categoryValue !== "string") {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Valid category is required",
      });
    }

    // 🔹 Check category is not hidden
    const category = await ProductCategory.findOne({
      value: categoryValue,
      isHide: false,
    });

    if (!category) {
      return res.status(200).json({
        success: true,
        error: false,
        message: "Category hidden or not found",
        data: [],
      });
    }

    // 🔹 Fetch products under active category
    const products = await productModel.find({
      category: category.value,
    });

    res.status(200).json({
      success: true,
      error: false,
      message: "Category wise products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error("Error fetching category wise products:", err);
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

module.exports = getCategoryWiseProduct;