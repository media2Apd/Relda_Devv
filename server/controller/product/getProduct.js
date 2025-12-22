const productModel = require("../../models/productModel")
const ProductCategory = require("../../models/productCategory");
const getProductController = async(req,res)=>{
    try{
        const allProduct = await productModel.find().sort({ createdAt : -1 })

        res.json({
            message : "All Product",
            success : true,
            error : false,
            data : allProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}

const getActiveProductController = async (req, res) => {
  try {
    // ====================================================
    // 🔹 STEP 1: GET ALL ACTIVE CATEGORIES (CHILD)
    // ====================================================
    const activeCategories = await ProductCategory.find({
      isHide: false
    }).select("value parentCategory").lean();

    // ====================================================
    // 🔹 STEP 2: FILTER OUT CATEGORIES WITH HIDDEN PARENTS
    // ====================================================
    const validCategoryValues = [];

    for (const category of activeCategories) {
      if (category.parentCategory) {
        const parent = await ProductCategory.findById(
          category.parentCategory
        ).select("isHide").lean();

        if (parent && parent.isHide === true) {
          continue; // ❌ skip this category
        }
      }

      validCategoryValues.push(category.value);
    }

    // ====================================================
    // 🔹 STEP 3: FETCH PRODUCTS ONLY FROM VALID CATEGORIES
    // ====================================================
    const allProduct = await productModel
      .find({
        category: { $in: validCategoryValues }
      })
      .sort({ createdAt: -1 });

    res.json({
      message: "All Product",
      success: true,
      error: false,
      data: allProduct
    });

  } catch (err) {
    console.error("getProductController error:", err);
    res.status(500).json({
      message: err.message || "Internal server error",
      error: true,
      success: false
    });
  }
};

module.exports = {  getProductController, getActiveProductController }