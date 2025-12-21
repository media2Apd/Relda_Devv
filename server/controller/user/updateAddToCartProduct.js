const addToCartModel = require("../../models/cartProduct")

// const updateAddToCartProduct = async(req,res)=>{
//     try{
//         const currentUserId = req.userId 
//         const addToCartProductId = req?.body?._id

//         const qty = req.body.quantity

//         const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId},{
//             ...(qty && {quantity : qty})
//         })

//         res.json({
//             message : "Product Updated",
//             data : updateProduct,
//             error : false,
//             success : true
//         })

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }
const updateAddToCartProduct = async (req, res) => {
  try {
    // 🔒 HARD BLOCK: quantity update NOT allowed
    return res.status(400).json({
      success: false,
      error: true,
      message: "Quantity update not allowed. Only 1 product per day is allowed."
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: err?.message || "Internal server error"
    });
  }
};

// module.exports = updateAddToCartProduct;

module.exports = updateAddToCartProduct