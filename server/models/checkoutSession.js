// models/checkoutSession.model.js
const mongoose = require("mongoose");

const checkoutSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  cartSnapshot: Array,

  couponSnapshot: Object,

  pricing: {
    subTotal: Number,
    discount: Number,
    finalAmount: Number
  },

  razorpayOrderId: String,

  status: {
    type: String,
    enum: ["pending", "paid", "expired"],
    default: "pending"
  },

  expiresAt: Date
}, { timestamps: true });

const CheckoutSession = mongoose.model("CheckoutSession", checkoutSessionSchema);
module.exports = CheckoutSession;
