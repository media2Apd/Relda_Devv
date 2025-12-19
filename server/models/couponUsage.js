// models/couponUsage.model.js
const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema({
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: String
}, { timestamps: true });

couponUsageSchema.index({ couponId: 1, userId: 1 }, { unique: true });

const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);

module.exports = CouponUsage;