// // controllers/coupon.controller.js
// const Coupon = require("../../models/coupon");

// /**
//  * CREATE COUPON
//  */
// exports.createCoupon = async function (req, res) {
//   try {
//     const coupon = await Coupon.create(req.body);
//     return res.json({ success: true, data: coupon });
//   } catch (err) {
//     return res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// /**
//  * GET ALL COUPONS (ADMIN)
//  */
// exports.getAllCoupons = async function (req, res) {
//   try {
//     const coupons = await Coupon.find().sort({ createdAt: -1 });
//     return res.json({ success: true, data: coupons });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * GET SINGLE COUPON
//  */
// exports.getCouponById = async function (req, res) {
//   try {
//     const coupon = await Coupon.findById(req.params.id);
//     if (!coupon) {
//       return res.status(404).json({ success: false, message: "Coupon not found" });
//     }
//     return res.json({ success: true, data: coupon });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// };

// /**
//  * UPDATE COUPON
//  */
// exports.updateCoupon = async function (req, res) {
//   try {
//     const coupon = await Coupon.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!coupon) {
//       return res.status(404).json({ success: false, message: "Coupon not found" });
//     }

//     return res.json({ success: true, data: coupon });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// };

// /**
//  * DELETE COUPON
//  */
// exports.deleteCoupon = async function (req, res) {
//   try {
//     const coupon = await Coupon.findByIdAndDelete(req.params.id);

//     if (!coupon) {
//       return res.status(404).json({ success: false, message: "Coupon not found" });
//     }

//     return res.json({ success: true, message: "Coupon deleted" });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// };

// /**
//  * ENABLE / DISABLE COUPON
//  */
// exports.toggleCouponStatus = async function (req, res) {
//   try {
//     const coupon = await Coupon.findById(req.params.id);
//     if (!coupon) {
//       return res.status(404).json({ success: false, message: "Coupon not found" });
//     }

//     coupon.isActive = !coupon.isActive;
//     await coupon.save();

//     return res.json({
//       success: true,
//       message: `Coupon ${coupon.isActive ? "enabled" : "disabled"}`,
//       data: coupon
//     });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// };
const Coupon = require("../../models/coupon");
const Product = require("../../models/productModel");
const ProductCategory = require("../../models/productCategory");
const CouponUsage = require("../../models/couponUsage");
const Order = require("../../models/orderProductModel");
/* -----------------------------------
   CREATE COUPON
----------------------------------- */
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      expiryDate,
      isActive,
      usageLimit,
      perUserLimit,
      parentCategory,
      productCategory,
      products
    } = req.body;

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate: startDate || new Date(),
      expiryDate,
      isActive,
      usageLimit,
      perUserLimit,
      parentCategory: parentCategory || null,
      productCategory: productCategory || null,
      products: Array.isArray(products) ? products : []
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/* -----------------------------------
   GET ALL COUPONS (ADMIN)
----------------------------------- */
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .populate("parentCategory productCategory products", "name value productName");

    return res.json({
      success: true,
      data: coupons
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* -----------------------------------
   GET SINGLE COUPON
----------------------------------- */
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("parentCategory productCategory products", "name value productName");

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    return res.json({
      success: true,
      data: coupon
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* -----------------------------------
   UPDATE COUPON
----------------------------------- */
exports.updateCoupon = async (req, res) => {
  try {
    const allowedUpdates = [
      "discountType",
  "discountValue",
  "minOrderAmount",
  "maxDiscountAmount",
  "startDate",
  "expiryDate",
  "isActive",
  "usageLimit",
  "perUserLimit",
  "parentCategory",
  "productCategory",
  "products"
    ];

    const updateData = {};

    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        // 🔥 convert empty string to null
        if (
          (key === "parentCategory" || key === "productCategory") &&
          req.body[key] === ""
        ) {
          updateData[key] = null;
        } else {
          updateData[key] = req.body[key];
        }
      }
    });

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    return res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/* -----------------------------------
   DELETE COUPON
----------------------------------- */
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    return res.json({
      success: true,
      message: "Coupon deleted successfully"
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* -----------------------------------
   ENABLE / DISABLE COUPON
----------------------------------- */
exports.toggleCouponStatus = async (req, res) => {
  try {
    const { isActive } = req.body; // optional (true / false)

    const coupon = await Coupon.findById(req.params.id);
console.log(req.params.id);
console.log(coupon);


    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    // 🔒 Expiry validation (enable not allowed)
    if (
      isActive === true &&
      coupon.expiryDate &&
      new Date(coupon.expiryDate) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Expired coupon cannot be enabled"
      });
    }

    // 🔁 Toggle OR explicit set
    coupon.isActive =
      typeof isActive === "boolean"
        ? isActive
        : !coupon.isActive;

    await coupon.save();

    return res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? "enabled" : "disabled"} successfully`,
      data: coupon
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};
exports.verifyCoupon = async (req, res) => {
  try {
    const { couponCode, cartItems } = req.body;

    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true
    }).populate("productCategory parentCategory products");

    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon"
      });
    }

    const now = new Date();

    // ⏳ Date validation
    if (coupon.startDate && now < coupon.startDate)
      return res.status(400).json({ success: false, message: "Coupon not started yet" });

    if (coupon.expiryDate && now > coupon.expiryDate)
      return res.status(400).json({ success: false, message: "Coupon expired" });

    // 💰 subtotal
    const subTotal = cartItems.reduce(
      (sum, i) => sum + i.quantity * i.productId.sellingPrice,
      0
    );

    if (subTotal < coupon.minOrderAmount)
      return res.status(400).json({
        success: false,
        message: `Minimum ₹${coupon.minOrderAmount} required`
      });

    // ==================================================
    // 🎯 APPLICABILITY CHECK (IMPORTANT PART)
    // ==================================================

    let applicable = false;

    for (const item of cartItems) {
      const product = item.productId;

      // 🥇 Product-specific coupon
      if (coupon.products?.length) {
        if (coupon.products.some(p => p._id.equals(product._id))) {
          applicable = true;
          break;
        }
        continue;
      }

      // 🥈 Product category coupon
      if (coupon.productCategory) {
        if (product.category === coupon.productCategory.value) {
          applicable = true;
          break;
        }
        continue;
      }

      // 🥉 Parent category coupon
      if (coupon.parentCategory) {
        if (product.parentCategory?.equals(coupon.parentCategory._id)) {
          applicable = true;
          break;
        }
        continue;
      }

      // 🌍 Global coupon
      applicable = true;
    }

    if (!applicable) {
      return res.status(400).json({
        success: false,
        message: "Coupon not applicable for selected items"
      });
    }

    // 💸 Discount calculation
    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (subTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }

    return res.json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        coupon: coupon.code,
        discountAmount,
        finalAmount: subTotal - discountAmount
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// exports.getApplicableCoupons = async (req, res) => {
//   try {
//     const { productId, productCategory, parentCategory } = req.query;

//     const now = new Date();

//     const coupons = await Coupon.find({
//       isActive: true,
//       $or: [
//         // 🥇 Product specific
//         productId
//           ? { products: productId }
//           : null,

//         // 🥈 Sub-category
//         productCategory
//           ? { productCategory }
//           : null,

//         // 🥉 Parent category
//         parentCategory
//           ? { parentCategory }
//           : null,

//         // 🌍 Global coupons
//         {
//           products: { $size: 0 },
//           productCategory: null,
//           parentCategory: null
//         }
//       ].filter(Boolean), // 🔥 remove nulls
//       $and: [
//         {
//           $or: [
//             { expiryDate: null },
//             { expiryDate: { $gte: now } }
//           ]
//         },
//         {
//           $or: [
//             { startDate: null },
//             { startDate: { $lte: now } }
//           ]
//         }
//       ]
//     })
//       .sort({ createdAt: -1 })
//       .populate("parentCategory", "name")
//       .populate("productCategory", "value")
//       .populate("products", "productName");

//     return res.json({
//       success: true,
//       count: coupons.length,
//       data: coupons
//     });

//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message || "Internal server error"
//     });
//   }
// };

exports.getApplicableCoupons = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.userId;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "productIds array is required"
      });
    }

    const now = new Date();

    // 1️⃣ PRODUCTS
    const products = await Product.find(
      { _id: { $in: productIds } },
      "_id category"
    ).lean();

    if (!products.length) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const productIdList = products.map(p => p._id);
    const categoryValues = [...new Set(products.map(p => p.category))];

    // 2️⃣ PRODUCT CATEGORY + PARENT
    const productCategories = await ProductCategory.find(
      { value: { $in: categoryValues } },
      "_id parentCategory"
    ).lean();

    const productCategoryIds = productCategories.map(c => c._id);
    const parentCategoryIds = productCategories.map(c => c.parentCategory).filter(Boolean);

    // 3️⃣ USED COUPONS (SUCCESS ONLY)
    const successOrders = await Order.find(
      { userId, "paymentDetails.payment_status": "success" },
      "orderId"
    ).lean();
console.log(successOrders);

    const successOrderIds = successOrders.map(o => o.orderId);
console.log(successOrderIds);
    const usedCoupons = await CouponUsage.find(
      { userId, orderId: { $in: successOrderIds } },
      "couponId"
    ).lean();

    const usedCouponIds = usedCoupons.map(c => c.couponId);

    // 4️⃣ APPLICABLE COUPONS
    const coupons = await Coupon.find({
      _id: { $nin: usedCouponIds },
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] }
      ],
      $or: [
        { products: { $in: productIdList } },
        { products: { $size: 0 }, productCategory: { $in: productCategoryIds } },
        {
          products: { $size: 0 },
          parentCategory: { $in: parentCategoryIds },
          productCategory: { $in: productCategoryIds }
        },
        { products: { $size: 0 }, productCategory: null, parentCategory: null }
      ]
    })
      .populate("parentCategory", "name")
      .populate("productCategory", "value");

    return res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

