const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

const Coupon = require("../models/coupon");
const CouponUsage = require("../models/couponUsage");
const CheckoutSession = require("../models/checkoutSession");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createCheckout = async function (req, res) {
  try {
    const cartItems = req.body.cartItems;
    const couponCode = req.body.couponCode;
    const userId = req.userId;

    if (!cartItems || !cartItems.length) {
      return res.status(400).json({ success: false, message: "Cart empty" });
    }

    // 🔐 SERVER SIDE PRICE CALCULATION
    let subTotal = cartItems.reduce(function (sum, i) {
      return sum + i.quantity * i.product.sellingPrice;
    }, 0);

    let discount = 0;
    let couponSnapshot = null;

    // 🎟️ COUPON VALIDATION
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true
      });

      if (!coupon) throw new Error("Invalid coupon");
      if (coupon.expiryDate && coupon.expiryDate < new Date())
        throw new Error("Coupon expired");
      if (subTotal < coupon.minOrderAmount)
        throw new Error("Minimum order ₹" + coupon.minOrderAmount);

      const alreadyUsed = await CouponUsage.findOne({
        couponId: coupon._id,
        userId: userId
      });

      if (alreadyUsed) throw new Error("Coupon already used");

      discount =
        coupon.discountType === "percentage"
          ? (subTotal * coupon.discountValue) / 100
          : coupon.discountValue;

      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }

      couponSnapshot = {
        couponId: coupon._id,
        code: coupon.code,
        discountApplied: discount
      };
    }

    const finalAmount = Math.max(subTotal - discount, 0);

    // 💳 CREATE RAZORPAY ORDER (ONLY ONCE)
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: "rcpt_" + uuidv4().slice(0, 8)
    });

    // 🔒 PRICE LOCK
    const checkout = await CheckoutSession.create({
      userId: userId,
      cartSnapshot: cartItems,
      couponSnapshot: couponSnapshot,
      pricing: {
        subTotal: subTotal,
        discount: discount,
        finalAmount: finalAmount
      },
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    return res.json({
      success: true,
      checkoutSessionId: checkout._id,
      razorpayOrderId: razorpayOrder.id,
      amount: finalAmount * 100
    });

  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
