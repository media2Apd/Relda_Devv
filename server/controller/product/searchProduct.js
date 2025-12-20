// const productModel = require("../../models/productModel")

// const searchProduct = async(req,res)=>{
//     try{
//         const query = req.query.q 

//         const regex = new RegExp(query,'i','g')

//         const product = await productModel.find({
//             "$or" : [
//                 {
//                     productName : regex
//                 },
//                 {
//                     category : regex
//                 }
//             ]
//         })


//         res.json({
//             data  : product ,
//             message : "Search Product list",
//             error : false,
//             success : true
//         })
//     }catch(err){
//         res.json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = searchProduct

const productModel = require("../../models/productModel");
const ProductCategory = require("../../models/productCategory");

const searchProduct = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Search query is required",
      });
    }

    const regex = new RegExp(q, "i");

    // 🔹 1️⃣ Get ACTIVE categories ONLY
    const activeCategories = await ProductCategory.find({
      isHide: false,
    }).select("value");

    const activeCategoryValues = activeCategories.map(cat => cat.value);

    // 🔹 2️⃣ Find products
    const products = await productModel.find({
      productName: regex,
      category: { $in: activeCategoryValues }
    });

    res.status(200).json({
      success: true,
      error: false,
      message: "Search Product list",
      data: products,
    });

  } catch (err) {
    console.error("Search product error:", err);
    res.status(500).json({
      success: false,
      error: true,
      message: err.message || "Internal server error",
    });
  }
};

module.exports = searchProduct;


