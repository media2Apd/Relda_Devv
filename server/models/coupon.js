// models/coupon.model.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, uppercase: true, required: true },

  discountType: {
    type: String,
    enum: ["percentage", "flat"],
    required: true
  },

  discountValue: { type: Number, required: true },

  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },

  expiryDate: Date,

  isActive: { type: Boolean, default: true },

  usageLimit: Number,
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;