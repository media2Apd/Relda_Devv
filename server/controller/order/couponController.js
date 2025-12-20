// controllers/coupon.controller.js
const Coupon = require("../../models/coupon");

/**
 * CREATE COUPON
 */
exports.createCoupon = async function (req, res) {
  try {
    const coupon = await Coupon.create(req.body);
    return res.json({ success: true, data: coupon });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * GET ALL COUPONS (ADMIN)
 */
exports.getAllCoupons = async function (req, res) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: coupons });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET SINGLE COUPON
 */
exports.getCouponById = async function (req, res) {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.json({ success: true, data: coupon });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE COUPON
 */
exports.updateCoupon = async function (req, res) {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    return res.json({ success: true, data: coupon });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * DELETE COUPON
 */
exports.deleteCoupon = async function (req, res) {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    return res.json({ success: true, message: "Coupon deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * ENABLE / DISABLE COUPON
 */
exports.toggleCouponStatus = async function (req, res) {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    return res.json({
      success: true,
      message: `Coupon ${coupon.isActive ? "enabled" : "disabled"}`,
      data: coupon
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
