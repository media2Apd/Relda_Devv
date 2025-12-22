// const addToCartModel = require("../../models/cartProduct")

// // const updateAddToCartProduct = async(req,res)=>{
// //     try{
// //         const currentUserId = req.userId 
// //         const addToCartProductId = req?.body?._id

// //         const qty = req.body.quantity

// //         const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId},{
// //             ...(qty && {quantity : qty})
// //         })

// //         res.json({
// //             message : "Product Updated",
// //             data : updateProduct,
// //             error : false,
// //             success : true
// //         })

// //     }catch(err){
// //         res.json({
// //             message : err?.message || err,
// //             error : true,
// //             success : false
// //         })
// //     }
// // }
// const updateAddToCartProduct = async (req, res) => {
//   try {
//     // 🔒 HARD BLOCK: quantity update NOT allowed
//     return res.status(400).json({
//       success: false,
//       error: true,
//       message: "Quantity update not allowed. Only 1 product per day is allowed."
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: err?.message || "Internal server error"
//     });
//   }
// };

// // module.exports = updateAddToCartProduct;

// module.exports = updateAddToCartProduct

const addToCartModel = require("../../models/cartProduct");

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

const updateAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.sessionId || null;
    const { _id, quantity } = req.body;

    if (!_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Cart item id and quantity are required"
      });
    }

    // 🔹 Find cart item
    const cartItem = await addToCartModel.findOne({
      _id,
      ...(userId ? { userId } : { sessionId })
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Cart item not found"
      });
    }

    // 🔒 Minimum quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Minimum quantity is 1"
      });
    }

    const now = Date.now();
    const lastUpdated = new Date(cartItem.updatedAt).getTime();
    const isNextDay = now - lastUpdated >= TWENTY_FOUR_HOURS;

    // 🔥 BLOCK SAME-DAY INCREASE
    if (quantity > cartItem.quantity && !isNextDay) {
      return res.status(400).json({
        success: false,
        error: true,
        message:
          "Quantity increase is allowed only after 24 hours for this product"
      });
    }

    // ✅ ALLOW DECREASE (ANYTIME)
    // ✅ ALLOW INCREASE (AFTER 24 HOURS)
    cartItem.quantity = quantity;
    await cartItem.save();

    return res.json({
      success: true,
      error: false,
      message: "Quantity updated successfully",
      data: cartItem
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: true,
      message: err?.message || "Internal server error"
    });
  }
};

module.exports = updateAddToCartProduct;

