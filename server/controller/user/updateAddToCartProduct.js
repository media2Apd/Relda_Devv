

// const addToCartModel = require("../../models/cartProduct");

// const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

// const updateAddToCartProduct = async (req, res) => {
//   try {
//     const userId = req.userId || null;
//     const sessionId = req.sessionId || null;
//     const { _id, quantity } = req.body;

//     if (!_id || quantity === undefined) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Cart item id and quantity are required"
//       });
//     }

//     // 🔹 Find cart item
//     const cartItem = await addToCartModel.findOne({
//       _id,
//       ...(userId ? { userId } : { sessionId })
//     });

//     if (!cartItem) {
//       return res.status(404).json({
//         success: false,
//         error: true,
//         message: "Cart item not found"
//       });
//     }

//     // 🔒 Minimum quantity
//     if (quantity < 1) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message: "Minimum quantity is 1"
//       });
//     }

//     const now = Date.now();
//     const lastUpdated = new Date(cartItem.updatedAt).getTime();
//     const isNextDay = now - lastUpdated >= TWENTY_FOUR_HOURS;

//     // 🔥 BLOCK SAME-DAY INCREASE
//     if (quantity > cartItem.quantity && !isNextDay) {
//       return res.status(400).json({
//         success: false,
//         error: true,
//         message:
//           "Quantity increase is allowed only after 24 hours for this product"
//       });
//     }

//     // ✅ ALLOW DECREASE (ANYTIME)
//     // ✅ ALLOW INCREASE (AFTER 24 HOURS)
//     cartItem.quantity = quantity;
//     await cartItem.save();

//     return res.json({
//       success: true,
//       error: false,
//       message: "Quantity updated successfully",
//       data: cartItem
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: true,
//       message: err?.message || "Internal server error"
//     });
//   }
// };

// module.exports = updateAddToCartProduct;

const addToCartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");

const updateAddToCartProduct = async (req, res) => {
  try {
    const { _id, quantity } = req.body;
    const userId = req.userId || null;
    const sessionId = req.sessionId || null;

    const cartItem = await addToCartModel.findOne({
      _id,
      ...(userId ? { userId } : { sessionId })
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    const diff = quantity - cartItem.quantity;

    if (diff === 0) {
      return res.json({ success: true, message: "No change" });
    }

    const product = await productModel.findById(cartItem.productId);

    // 🔥 Increase quantity
    if (diff > 0) {
      if (product.availability - product.reservedStock < diff) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available"
        });
      }
      await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { reservedStock: diff } }
      );
    }

    // 🔥 Decrease quantity
    if (diff < 0) {
      await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { reservedStock: diff } } // diff negative
      );
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({
      success: true,
      message: "Cart updated",
      data: cartItem
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = updateAddToCartProduct;
