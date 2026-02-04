// const productModel = require("../../models/productModel")


// const getCategoryProduct = async(req,res)=>{
//     try{
//         const productCategory = await productModel.distinct("category")

//         console.log("category",productCategory)

//         //array to store one product from each category
//         const productByCategory = []

//         for(const category of productCategory){
//             const product = await productModel.findOne({category })

//             if(product){
//                 productByCategory.push(product)
//             }
//         }


//         res.json({
//             message : "category product",
//             data : productByCategory,
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

// module.exports = getCategoryProduct

const productModel = require("../../models/productModel");

const getCategoryProduct = async (req, res) => {
  try {
    // distinct works for both string & array
    const productCategories = await productModel.distinct("category");

    const productByCategory = [];

    for (const category of productCategories) {
      const product = await productModel.findOne({
        isHidden: { $ne: true },
        $or: [
          { category: category },        // ✅ string case
          { category: { $in: [category] } } // ✅ array case
        ]
      });

      if (product) {
        productByCategory.push({
          category,
          product
        });
      }
    }

    res.json({
      success: true,
      data: productByCategory,
      error: false
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: true,
      message: err.message || err
    });
  }
};

module.exports = getCategoryProduct;
