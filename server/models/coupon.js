// // models/coupon.model.js
// const mongoose = require("mongoose");

// const couponSchema = new mongoose.Schema({
//   code: { type: String, unique: true, uppercase: true, required: true },

//   discountType: {
//     type: String,
//     enum: ["percentage", "flat"],
//     required: true
//   },

//   discountValue: { type: Number, required: true },

//   minOrderAmount: { type: Number, default: 0 },
//   maxDiscountAmount: { type: Number },

//   expiryDate: Date,

//   isActive: { type: Boolean, default: true },

//   usageLimit: Number,
//   usedCount: { type: Number, default: 0 }
// }, { timestamps: true });

// const Coupon = mongoose.model("Coupon", couponSchema);
// module.exports = Coupon;

// models/coupon.model.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    uppercase: true,
    required: true
  },

  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true
  },

  discountValue: {
    type: Number,
    required: true
  },

  minOrderAmount: {
    type: Number,
    default: 0
  },

  maxDiscountAmount: Number,

  // ✅ ADD THIS
  startDate: {
    type: Date,
    default: Date.now
  },

  expiryDate: Date,

  isActive: {
    type: Boolean,
    default: true
  },

  usageLimit: Number,

  // ✅ ADD THIS
  perUserLimit: {
    type: Number,
    default: 1
  },

  usedCount: {
    type: Number,
    default: 0
  },

  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParentCategory",
    default: null
  },

  productCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
    default: null
  },

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product"
    }
  ]

}, { timestamps: true });


module.exports = mongoose.model("Coupon", couponSchema);
