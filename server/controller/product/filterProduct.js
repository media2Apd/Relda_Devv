const productModel = require("../../models/productModel")

// const filterProductController = async(req,res)=>{
//  try{
//         const categoryList = req?.body?.category 
//        let product;
//         if(categoryList.length > 0){
//              product = await productModel.find({
//                 category :  {
//                     "$in" : categoryList
//                 }
//             })
//         }else{
//             product = await productModel.find({})
//         }

//         res.json({
//             data : product,
//             message : "product",
//             error : false,
//             success : true
//         })
//  }catch(err){
//     res.json({
//         message : err.message || err,
//         error : true,
//         success : false
//     })
//  }
// }
const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];
    let product;

    const baseFilter = {
      zohoVariantId: { $exists: true }   // 🔥 important line
    };

    if (categoryList.length > 0) {
      product = await productModel.find({
        ...baseFilter,
        category: {
          $in: categoryList
        }
      });
    } else {
      product = await productModel.find(baseFilter);
    }

    res.json({
      data: product,
      message: "product",
      error: false,
      success: true
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};


module.exports = filterProductController