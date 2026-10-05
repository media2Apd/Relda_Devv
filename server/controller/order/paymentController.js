const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const orderModel = require('../../models/orderProductModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const querystring = require('querystring');
const userModel = require('../../models/userModel');
const addToCartModel = require('../../models/cartProduct'); 
const transporter = require('../../config/nodemailerConfig')
const cron = require('node-cron');
const moment = require('moment');
const axios = require('axios')
const productModel = require('../../models/productModel')
const { v4: uuidv4 } = require('uuid');
const cheerio = require('cheerio');
const CheckoutSession = require('../../models/checkoutSession');
const Coupon = require('../../models/coupon');
const CouponUsage = require('../../models/couponUsage');
const createSalesOrderAndReleaseStock = require("../../helpers/createZohoSO.helper");

const { voidZohoSalesOrder } = require("../../services/zohoSalesOrder.service");
const { createZohoSalesReturn } = require("../../services/zohoSalesReturn.service");
const { getZohoSalesOrder } = require("../../services/zohoSalesOrder.service");
const { getInvoiceDetails } = require("../../services/zohoInvoice.service");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function markCouponAsUsed({ couponId, userId, orderId }) {
  if (!couponId || !userId || !orderId) return;

  // 🔒 per-user limit
  const userUsageCount = await CouponUsage.countDocuments({
    couponId,
    userId
  });

  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new Error("Coupon not found");

  if (coupon.perUserLimit && userUsageCount >= coupon.perUserLimit) {
    throw new Error("Coupon usage limit reached for this user");
  }

  // 🔒 global usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon total usage limit reached");
  }

  // ✅ store usage
  await CouponUsage.create({
    couponId,
    userId,
    orderId
  });

  // ✅ atomic increment
  await Coupon.updateOne(
    { _id: couponId },
    { $inc: { usedCount: 1 } }
  );
}



exports.createCheckout = async (req, res) => {
  try {
    const { cartItems, couponCode } = req.body;
    const userId = req.userId;

    // 1️⃣ SERVER-SIDE PRICE CALCULATION
    let subTotal = cartItems.reduce(
      (sum, i) => sum + i.quantity * i.product.sellingPrice,
      0
    );

    let discount = 0;
    let couponSnapshot = null;

    // 2️⃣ COUPON VALIDATION
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true
      });

      if (!coupon) throw new Error("Invalid coupon");

      if (coupon.expiryDate && coupon.expiryDate < new Date())
        throw new Error("Coupon expired");

      if (subTotal < coupon.minOrderAmount)
        throw new Error(`Minimum ₹${coupon.minOrderAmount} required`);

      const alreadyUsed = await CouponUsage.findOne({
        couponId: coupon._id,
        userId
      });

      if (alreadyUsed) throw new Error("Coupon already used");

      if (coupon.discountType === "percentage")
        discount = (subTotal * coupon.discountValue) / 100;
      else
        discount = coupon.discountValue;

      if (coupon.maxDiscountAmount)
        discount = Math.min(discount, coupon.maxDiscountAmount);

      couponSnapshot = {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountApplied: discount,
        couponId: coupon._id
      };
    }

    const finalAmount = Math.max(subTotal - discount, 0);

    // 3️⃣ CREATE RAZORPAY ORDER
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${uuidv4().slice(0, 8)}`
    });

    // 4️⃣ SAVE CHECKOUT SESSION (PRICE LOCK 🔒)
    const checkout = await CheckoutSession.create({
      userId,
      cartSnapshot: cartItems,
      couponSnapshot,
      pricing: { subTotal, discount, finalAmount },
      razorpayOrderId: razorpayOrder.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: finalAmount * 100,
      checkoutSessionId: checkout._id
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getProductImageUrl = (productImage) => {
  if (!productImage || !Array.isArray(productImage)) return "";

  const first = productImage[0];

  // Case 1: String URL
  if (typeof first === "string") {
    return first;
  }

  // Case 2: Object { url, type }
  if (typeof first === "object" && first.url) {
    return first.url;
  }

  return "";
};

// exports.paymentController = async (req, res) => {
//     try {
//         const { cartItems, customerInfo, billingSameAsShipping, usePaymentLink, paymentMode, couponCode, gstDetails } = req.body;
//            /* ================= SAFETY ================= */
//     const safeGST = gstDetails || {};
        
//         // Validate customer info first
//         if (!customerInfo || typeof customerInfo !== 'object') {
//             return res.status(400).json({ message: "Invalid customer information", success: false });
//         }

//         // Calculate subtotal first (for all payment modes)
//         let subTotal = cartItems.reduce((total, item) => {
//             return total + item.quantity * item.productId.sellingPrice;
//         }, 0);
        
//         // Apply coupon logic (for all payment modes)
//         let discountAmount = 0;
//         let appliedCoupon = null;
        
//         if (couponCode) {
//             const coupon = await Coupon.findOne({
//                 code: couponCode.toUpperCase(),
//                 isActive: true
//             });
            
//             if (!coupon) {
//                 return res.status(400).json({ success: false, message: "Invalid coupon" });
//             }
            
//             if (coupon.expiryDate && coupon.expiryDate < new Date()) {
//                 return res.status(400).json({ success: false, message: "Coupon expired" });
//             }
            
//             if (subTotal < coupon.minOrderAmount) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Minimum order ₹${coupon.minOrderAmount}`
//                 });
//             }
            
//             discountAmount = coupon.discountType === "percentage"
//                 ? (subTotal * coupon.discountValue) / 100
//                 : coupon.discountValue;
            
//             if (coupon.maxDiscountAmount) {
//                 discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
//             }
            
//             appliedCoupon = {
//                 code: coupon.code,
//                 discountAmount: discountAmount
//             };
//         }
//         // Calculate final amount after discount
//         const finalAmount = Math.max(subTotal - discountAmount, 0);

//         // Prepare addresses
//         const shippingAddress = {
//             street: customerInfo.street || '',
//             city: customerInfo.city || '',
//             state: customerInfo.state || '',
//             postalCode: customerInfo.postalCode || '',
//             country: customerInfo.country || '',
//         };

//         const billingAddress = billingSameAsShipping
//             ? shippingAddress
//             : {
//                 street: customerInfo.billingAddress?.street || '',
//                 city: customerInfo.billingAddress?.city || '',
//                 state: customerInfo.billingAddress?.state || '',
//                 postalCode: customerInfo.billingAddress?.postalCode || '',
//                 country: customerInfo.billingAddress?.country || '',
//             };

//         // 💰 CASH ON HAND FLOW
//         if (paymentMode === "CASH_ON_HAND") {
//             const order = await orderModel.create({
//                 orderId: `CASH-${uuidv4().slice(0, 8)}`,
//                 productDetails: cartItems.map(item => ({
//                     productId: item.productId._id,
//                     productName: item.productId.productName,
//                     brandName: item.productId.brandName,
//                     category: item.productId.category,
//                     quantity: item.quantity,
//                     price: item.productId.price,
//                     sellingPrice: item.productId.sellingPrice,
//                     basePrice: item.productId.basePrice,
//                     productImage: getProductImageUrl(item.productId.productImage),
//                 })),
//                 email: customerInfo.email,
//                 userId: req.userId,
//                 subTotal: subTotal,
//                 discountAmount: discountAmount || 0,
//                 couponCode: appliedCoupon?.code || null,
//                 totalAmount: finalAmount,
//                 paymentDetails: {
//                     payment_status: "cash_on_hand",
//                     payment_method_type: "CASH"
//                 },
//                 billing_name: customerInfo.firstName,
//                 billing_email: customerInfo.email,
//                 billing_tel: customerInfo.phone,
//                 billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
//                 shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
//                  gstDetails: {
//                   gstin: safeGST.gstin || null,
//                   companyName: safeGST.companyName || null
//                 },
//                 statusUpdates: [{
//                     status: "ordered",
//                     updatedAt: new Date()
//                 }],
//                 createdAt: new Date()
//             });
//             const user = await userModel.findById(req.userId);

// // await createSalesOrderAndReleaseStock(order, user);
// // AFTER order creation
// const fullOrder = await orderModel.findOne({
//   orderId: order.orderId
// });

// const customerUser = await userModel.findById(fullOrder.userId);
// const staffUser = req.user; // MANAGESALES

// await createSalesOrderAndReleaseStock(
//   fullOrder,
//   customerUser,
//   staffUser
// );

// // 🛒 CLEAR CART
// await addToCartModel.deleteMany({ userId: req.userId });
// console.log("🛒 Cart cleared for CASH_ON_HAND order");


//    // ✅ MARK COUPON USED (ONLY HERE)
//       if (couponCode) {
//         await markCouponAsUsed({
//           coupon: couponCode,
//           userId: req.userId,
//           orderId: order.orderId
//         });
//       }
//             return res.json({
//                 success: true,
//                 message: "Order confirmed with Cash on Hand",
//                 orderId: order.orderId,
//                 totalAmount: finalAmount,
//                 discountAmount: discountAmount,
//                 couponCode: appliedCoupon?.code || null
//             });
//         }

//         // 💳 ONLINE PAYMENT FLOW (Razorpay)
//         const user = await userModel.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

//         // Convert to paise for Razorpay
//         const totalAmountInPaise = finalAmount * 100;
//         const receiptId = `order_rcptid_${uuidv4().slice(0, 8)}`;

//         // Create Payment Order or Link
//         let paymentResponse;
//         let orderIdOrLink;

//         if (usePaymentLink) {
//             // Create Payment Link
//             paymentResponse = await razorpay.paymentLink.create({
//                 amount: totalAmountInPaise,
//                 currency: "INR",
//                 accept_partial: false,
//                 description: "Purchase from Online Store",
//                 customer: {
//                     name: customerInfo.firstName,
//                     contact: customerInfo.phone,
//                     email: customerInfo.email,
//                 },
//                 notify: {
//                     sms: true,
//                     email: true
//                 },
//                 reminder_enable: true,
//                 callback_url: "https://www.reldaindia.com/success",
//                 callback_method: "get"
//             });

//             if (!paymentResponse || !paymentResponse.id) {
//                 throw new Error("Failed to create Razorpay Payment Link");
//             }

//             orderIdOrLink = paymentResponse.id;

//         } else {
//             // Create Razorpay Order
//             const options = {
//                 amount: totalAmountInPaise,
//                 currency: "INR",
//                 receipt: receiptId,
//                 payment_capture: 1
//             };

//             paymentResponse = await razorpay.orders.create(options);
//             if (!paymentResponse || !paymentResponse.id) {
//                 throw new Error("Failed to create Razorpay order.");
//             }

//             orderIdOrLink = paymentResponse.id;
//         }

//         const statusId = `pending-${req.userId}-${uuidv4()}`;

//         // Check if order exists and update or create new
//         const existingOrder = await orderModel.findOne({ orderId: orderIdOrLink });
        
//         if (existingOrder) {
//             if (!existingOrder.statusUpdates.some(status => status.status === statusId)) {
//                 existingOrder.statusUpdates.push({
//                     status: statusId,
//                     updatedAt: new Date()
//                 });
                
//                 // Update discount info if it changed
//                 existingOrder.discountAmount = discountAmount || 0;
//                 existingOrder.couponCode = appliedCoupon?.code || null;
//                 existingOrder.subTotal = subTotal;
//                 existingOrder.totalAmount = finalAmount;
                
//                 await existingOrder.save();
//             }
//         } else {
//             await orderModel.create({
//                 orderId: orderIdOrLink,
//                 productDetails: cartItems.map(item => ({
//                     productId: item.productId._id,
//                     brandName: item.productId.brandName,
//                     productName: item.productId.productName,
//                     category: item.productId.category,
//                     quantity: item.quantity,
//                     price: item.productId.price,
//                     availability: item.productId.availability,
//                     sellingPrice: item.productId.sellingPrice,
//                     basePrice: item.productId.basePrice,
//                     productImage: getProductImageUrl(item.productId.productImage),
//                 })),
//                 email: customerInfo.email,
//                 userId: req.userId,
//                 subTotal: subTotal,
//                 discountAmount: discountAmount || 0,
//                 couponCode: appliedCoupon?.code || null,
//                 totalAmount: finalAmount,
//                 paymentDetails: {
//                     paymentId: "",
//                     payment_method_type: "",
//                     payment_status: "pending",
//                 },
//                 billing_name: customerInfo.firstName,
//                 billing_email: customerInfo.email,
//                 billing_tel: customerInfo.phone,
//                 billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
//                 shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
//               gstDetails: {
//                 gstin: safeGST.gstin || null,
//                 companyName: safeGST.companyName || null
//               },
//                 statusUpdates: [{
//                     status: statusId,
//                     updatedAt: new Date()
//                 }],
//                 createdAt: new Date(),
//             });
//         }
//          // ✅ MARK COUPON USED (ONLY HERE)
//       if (couponCode) {
//         await markCouponAsUsed({
//           coupon: couponCode,
//           userId: req.userId,
//           orderId: orderIdOrLink
//         });
//       }
//         // Return response with all payment details
//         res.json({
//             success: true,
//             mode: usePaymentLink ? 'link' : 'order',
//             orderId: orderIdOrLink,
//             amount: totalAmountInPaise,
//             currency: "INR",
//             customerInfo,
//             subTotal: subTotal,
//             discountAmount: discountAmount,
//             couponCode: appliedCoupon?.code || null,
//             finalAmount: finalAmount,
//             ...(usePaymentLink && { paymentLink: paymentResponse.short_url })
//         });

//     } catch (error) {
//         console.error("Error initiating payment:", error);
//         res.status(500).json({
//             message: error.message || "Internal Server Error",
//             success: false,
//         });
//     }
// };
// controllers/order/paymentController.js

exports.paymentController = async (req, res) => {
  try {
    const {
      cartItems,
      customerInfo,
      billingSameAsShipping,
      usePaymentLink,
      paymentMode,
      couponCode,
      gstDetails,
      saleInHand,   // 👈 Extracted
      serialNumber  // 👈 Extracted
    } = req.body;

    const safeGST = gstDetails || {};

    if (!customerInfo || typeof customerInfo !== 'object') {
      return res.status(400).json({ message: "Invalid customer information", success: false });
    }

    // Subtotal calculation
    let subTotal = cartItems.reduce((total, item) => {
      return total + item.quantity * (item.productId?.sellingPrice || item.sellingPrice);
    }, 0);

    // Coupon calculation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true
      });

      if (!coupon) return res.status(400).json({ success: false, message: "Invalid coupon" });
      if (coupon.expiryDate && coupon.expiryDate < new Date()) return res.status(400).json({ success: false, message: "Coupon expired" });
      if (subTotal < coupon.minOrderAmount) {
        return res.status(400).json({ success: false, message: `Minimum order ₹${coupon.minOrderAmount}` });
      }

      discountAmount = coupon.discountType === "percentage"
        ? (subTotal * coupon.discountValue) / 100
        : coupon.discountValue;

      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }

      appliedCoupon = { code: coupon.code, discountAmount };
    }

    const finalAmount = Math.max(subTotal - discountAmount, 0);

    const shippingAddress = {
      street: customerInfo.street || '',
      city: customerInfo.city || '',
      state: customerInfo.state || '',
      postalCode: customerInfo.postalCode || '',
      country: customerInfo.country || '',
    };

    const billingAddress = billingSameAsShipping
      ? shippingAddress
      : {
          street: customerInfo.billingAddress?.street || '',
          city: customerInfo.billingAddress?.city || '',
          state: customerInfo.billingAddress?.state || '',
          postalCode: customerInfo.billingAddress?.postalCode || '',
          country: customerInfo.billingAddress?.country || '',
        };

    const formattedProductDetails = cartItems.map(item => ({
      productId: item.productId?._id || item.productId,
      productName: item.productId?.productName || item.productName,
      brandName: item.productId?.brandName || item.brandName,
      category: item.productId?.category || item.category,
      quantity: item.quantity,
      price: item.productId?.price || item.price,
      sellingPrice: item.productId?.sellingPrice || item.sellingPrice,
      basePrice: item.productId?.basePrice || item.basePrice,
      productImage: getProductImageUrl(item.productId?.productImage),
      serialNumber: item.serialNumber || serialNumber || null // 👈 item-level or global
    }));

    // ==========================================
    // 💰 1. CASH ON HAND FLOW
    // ==========================================
    if (paymentMode === "CASH_ON_HAND") {
      const order = await orderModel.create({
        orderId: `CASH-${uuidv4().slice(0, 8)}`,
        productDetails: formattedProductDetails,
        email: customerInfo.email,
        userId: req.userId,
        subTotal,
        discountAmount,
        couponCode: appliedCoupon?.code || null,
        totalAmount: finalAmount,
        paymentDetails: {
          payment_status: saleInHand ? "paid" : "cash_on_hand",
          payment_method_type: "CASH"
        },
        saleInHand: Boolean(saleInHand),
        serialNumber: serialNumber || null,
        billing_name: customerInfo.firstName,
        billing_email: customerInfo.email,
        billing_tel: customerInfo.phone,
        billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
        shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
        gstDetails: {
          gstin: safeGST.gstin || null,
          companyName: safeGST.companyName || null
        },
        statusUpdates: [{
          status: saleInHand ? "delivered" : "ordered",
          updatedAt: new Date()
        }],
        order_status: saleInHand ? "delivered" : "ordered",
        createdAt: new Date()
      });

      const fullOrder = await orderModel.findOne({ orderId: order.orderId });
      const customerUser = await userModel.findById(fullOrder.userId);
      const staffUser = req.user;

      await createSalesOrderAndReleaseStock(fullOrder, customerUser, staffUser);

      await addToCartModel.deleteMany({ userId: req.userId });

      if (couponCode) {
        await markCouponAsUsed({
          couponId: couponCode,
          userId: req.userId,
          orderId: order.orderId
        });
      }
      // 🔥 4️⃣ EMAIL NOTIFICATION SENDING (Customer & Admin)
      try {
        await Promise.all([
          sendCashOrderConfirmationEmail(fullOrder),
          sendAdminNotificationEmail(fullOrder)
        ]);
        console.log("✅ Confirmation & Admin emails sent for CASH order:", fullOrder.orderId);
      } catch (emailErr) {
        console.error("❌ Error sending cash order emails:", emailErr.message);
      }
      return res.json({
        success: true,
        message: saleInHand ? "Sale in Hand Completed with Invoice" : "Order confirmed with Cash on Hand",
        orderId: order.orderId,
        totalAmount: finalAmount,
        discountAmount,
        couponCode: appliedCoupon?.code || null
      });
    }

    // ==========================================
    // 💳 2. ONLINE PAYMENT FLOW (Link or Razorpay)
    // ==========================================
    const totalAmountInPaise = Math.round(finalAmount * 100);
    let paymentResponse;
    let orderIdOrLink;

    if (usePaymentLink) {
      paymentResponse = await razorpay.paymentLink.create({
        amount: totalAmountInPaise,
        currency: "INR",
        accept_partial: false,
        description: `Order from Relda India (${saleInHand ? 'Instant Hand Delivery' : 'Standard Shipping'})`,
        customer: {
          name: customerInfo.firstName,
          contact: customerInfo.phone,
          email: customerInfo.email,
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        callback_url: "https://www.reldaindia.com/success",
        callback_method: "get"
      });

      if (!paymentResponse?.id) {
        throw new Error("Failed to create Razorpay Payment Link");
      }
      orderIdOrLink = paymentResponse.id;
    } else {
      paymentResponse = await razorpay.orders.create({
        amount: totalAmountInPaise,
        currency: "INR",
        receipt: `rcpt_${uuidv4().slice(0, 8)}`,
        payment_capture: 1
      });

      if (!paymentResponse?.id) {
        throw new Error("Failed to create Razorpay order.");
      }
      orderIdOrLink = paymentResponse.id;
    }

    // Save initial Pending Order in DB
    await orderModel.create({
      orderId: orderIdOrLink,
      productDetails: formattedProductDetails,
      email: customerInfo.email,
      userId: req.userId,
      subTotal,
      discountAmount,
      couponCode: appliedCoupon?.code || null,
      totalAmount: finalAmount,
      paymentDetails: {
        paymentId: "",
        payment_method_type: usePaymentLink ? "PAYMENT_LINK" : "ONLINE",
        payment_status: "pending",
      },
      saleInHand: Boolean(saleInHand),     // 👈 Saved for later webhook/cron/callback
      serialNumber: serialNumber || null, // 👈 Saved for later invoice generation
      billing_name: customerInfo.firstName,
      billing_email: customerInfo.email,
      billing_tel: customerInfo.phone,
      billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
      shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
      gstDetails: {
        gstin: safeGST.gstin || null,
        companyName: safeGST.companyName || null
      },
      order_status: "pending",
      statusUpdates: [{ status: "pending", updatedAt: new Date() }],
      createdAt: new Date(),
    });

    res.json({
      success: true,
      mode: usePaymentLink ? 'link' : 'order',
      orderId: orderIdOrLink,
      amount: totalAmountInPaise,
      currency: "INR",
      customerInfo,
      subTotal,
      discountAmount,
      couponCode: appliedCoupon?.code || null,
      finalAmount,
      ...(usePaymentLink && { paymentLink: paymentResponse.short_url })
    });

  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const sendCashOrderConfirmationEmail = async (order) => {
  try {
    const product = order.productDetails?.[0];
    if (!product) return;

    // Serial Number row
    const serialRow = order.serialNumber ? `
      <tr>
        <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Serial Number</td>
        <td style="padding: 12px 16px; color: #111; font-weight: bold; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace; letter-spacing: 1.5px;">
          ${order.serialNumber}
        </td>
      </tr>
    ` : '';

    const orderStatusBadge = order.order_status === 'delivered' 
      ? '<span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">Hand Delivered (Completed)</span>'
      : '<span style="background: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">Confirmed</span>';

    const mailOptions = {
      from: 'support@reldaindia.com',
      to: order.billing_email,
      subject: `Order Confirmation - #${order.orderId} | RELDA India`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <!-- Main Container -->
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- 1️⃣ Top Logo Bar (White Background - 100% Crystal Clear Logo) -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- 2️⃣ Brand Hero Banner (#E60000 Gradient) -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Order Confirmed!</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Thank you for shopping with RELDA</p>
                    </td>
                  </tr>

                  <!-- 3️⃣ Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <!-- Greeting -->
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${order.billing_name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        We have successfully processed your order. Your cash payment has been verified and registered. Here are the full details of your purchase:
                      </p>

                      <!-- Order ID Banner -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff5f5; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Order Reference ID</span>
                            <div style="font-size: 18px; font-weight: 800; color: #E60000; margin-top: 2px;">#${order.orderId}</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Product & Order Summary Card -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
                            Order Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Product Name</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.productName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Quantity</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: bold; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.quantity} unit(s)
                          </td>
                        </tr>
                        ${serialRow}
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Payment Method</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            Cash on Hand (Verified)
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Order Status</td>
                          <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${orderStatusBadge}
                          </td>
                        </tr>
                        <tr style="background-color: #fff9f9;">
                          <td style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Amount Paid</td>
                          <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                            ₹${Number(order.totalAmount).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Delivery / Billing Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Delivery / Shipping Address</span>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">
                              ${order.shipping_address}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Need Help Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding your order or warranty?
                            </p>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                              Email us: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                        Warm Regards,<br>
                        <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">www.reldaindia.com</a>
                      </p>
                    </td>
                  </tr>

                </table>
                <!-- End Main Container -->

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    console.log(`📧 Sending Fixed Logo Cash Order email to: ${order.billing_email}`);
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("❌ Failed to send Cash Order email:", err.message);
  }
};
const verifyRazorpayAuth = () => ({
  auth: {
    username: process.env.RAZORPAY_KEY_ID,
    password: process.env.RAZORPAY_KEY_SECRET,
  }
});

// Verify Payment Link status dynamically by passing paymentLinkId
async function verifyPaymentLinkStatus(paymentLinkId) {
  try {
    if (!paymentLinkId) throw new Error('Payment Link ID is required');
    const response = await axios.get(
      `https://api.razorpay.com/v1/payment_links/${paymentLinkId}`,
      verifyRazorpayAuth()
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching payment link ${paymentLinkId}:`, error.response?.data || error.message);
    return null;
  }
}

async function verifyPaymentStatus(paymentId) {
  try {
    console.log(`Fetching payment details for ID: ${paymentId}`);

    const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET
      }
    });

    const paymentDetails = response.data;
    const isPaymentCaptured = paymentDetails.status === 'captured';
    const paymentMethod = paymentDetails.method;

    // Return flattened object so calling function can use all details directly
    return {
      isPaymentCaptured,
      paymentMethod,
      ...paymentDetails // Spread actual Razorpay response directly
    };

  } catch (error) {
    console.error("Error verifying payment:", error?.response?.data || error.message);
    throw new Error("Error verifying payment");
  }
}


// cron.schedule('*/3 * * * *', async () => {

//   // cron.schedule('0 */4 * * *', async () => {
//   console.log('? Running scheduled Razorpay Payment Link verification...');

//   try {
//     // Find all pending orders where orderId starts with 'plink_'
//     const pendingOrders = await orderModel.find({
//       orderId: { $regex: /^plink_/ },
//       order_status: 'Pending',
//     });

//     if (!pendingOrders.length) {
//       console.log('?? No pending orders with Razorpay payment links found.');
//       return;
//     }

//     for (const order of pendingOrders) {
//       const paymentLinkId = order.orderId;

//       // Fetch payment link details dynamically
//       const paymentLinkDetails = await verifyPaymentLinkStatus(paymentLinkId);

//       if (!paymentLinkDetails) {
//         console.log(`?? Could not fetch details for payment link: ${paymentLinkId}`);
//         continue;
//       }

//       if (paymentLinkDetails.status === 'paid') {
//         // Extract actual Razorpay payment ID from payments array
//         const razorpayPaymentId = paymentLinkDetails.payments?.[0]?.payment_id;

//         if (!razorpayPaymentId) {
//           console.log(`?? No payment ID found in payment link details for ${paymentLinkId}`);
//           continue;
//         }

//         // Update order in DB
//         await orderModel.updateOne(
//           { orderId: paymentLinkId },
//           {
//             $set: {
//               'paymentDetails.paymentId': razorpayPaymentId,
//               'paymentDetails.payment_status': 'success',
//               'paymentDetails.payment_method_type': paymentLinkDetails.payment_method || null,
//               'paymentDetails.fullDetails': paymentLinkDetails,
//               order_status: 'ordered',
//               updatedAt: new Date(),
//             },
//             $push: { statusUpdates: { status: 'ordered', timestamp: new Date() } },
//           }
//         );
//         console.log(`? Order ${paymentLinkId} updated to ordered status.`);

//         // Clear user's cart after order
//         await addToCartModel.deleteMany({ userId: order.userId });
//         console.log('?? Cart has been cleared.');

//         // Set delivery date 4 days from now
//         const deliveryDate = moment().add(4, 'days').toDate();
//         await orderModel.updateOne({ orderId: paymentLinkId }, { $set: { delivered_at: deliveryDate } });

//         try {
//           // Send confirmation and admin notification emails & update product stock
//           const customerInfo = await userModel.findById(order.userId);
//           const cartItems = await addToCartModel.find({ userId: order.userId });

//           const emailPromises = [
//             sendOrderConfirmationEmailLink(customerInfo, razorpayPaymentId, order),
//             sendAdminNotificationEmail(order),
//           ];

//           const productUpdatePromises = cartItems.map(item =>
//             productModel.findByIdAndUpdate(
//               item.productId._id,
//               { $inc: { availability: -1 } },
//               { new: true }
//             )
//           );
// // const fullOrder = await orderModel.findOne({ orderId: paymentLinkId });
// // const user = await userModel.findById(fullOrder.userId);

// // await createSalesOrderAndReleaseStock(fullOrder, user);
// // const fullOrder = await orderModel.findOne({ orderId: paymentLinkId });
// // const customerUser = await userModel.findById(fullOrder.userId);
// // const staffUser = req.user; // role = MANAGESALES

// // await createSalesOrderAndReleaseStock(
// //   fullOrder,
// //   customerUser,
// //   staffUser
// // );
// const fullOrder = await orderModel.findOne({ orderId: paymentLinkId });
// const customerUser = await userModel.findById(fullOrder.userId);

// /* ✅ CRON SAFE STAFF USER */
// const staffUser = {
//   role: "MANAGESALES",
//   name: "SYSTEM-CRON"
// };

// await createSalesOrderAndReleaseStock(
//   fullOrder,
//   customerUser,
//   staffUser
// );


//           await Promise.all([...emailPromises, ...productUpdatePromises]);
//         } catch (emailOrStockError) {
//           console.error('? Error sending emails or updating product stock:', emailOrStockError);
//         }
//       } else {
//         console.log(`?? Order ${paymentLinkId} payment link status: ${paymentLinkDetails.status}`);
//       }
//     }
//   } catch (err) {
//     console.error('? Error verifying payment links:', err.response?.data || err.message || err);
//   }
// });
// controllers/order/paymentController.js (Cron Section)

cron.schedule('*/2 * * * *', async () => {
  try {
    // 1. Case-insensitive pending orders lookup
    const pendingOrders = await orderModel.find({
      orderId: { $regex: /^plink_/ },
      $or: [
        { order_status: { $in: ['pending', 'Pending'] } },
        { 'paymentDetails.payment_status': 'pending' }
      ]
    });

    if (!pendingOrders.length) return;

    for (const order of pendingOrders) {
      const paymentLinkId = order.orderId;
      const paymentLinkDetails = await verifyPaymentLinkStatus(paymentLinkId);

      if (!paymentLinkDetails) continue;

      if (paymentLinkDetails.status === 'paid') {
        const razorpayPaymentId =
          paymentLinkDetails.payments?.[0]?.payment_id || `pay_${paymentLinkId}`;
        const paymentMethod =
          paymentLinkDetails.payments?.[0]?.method || paymentLinkDetails.payment_method || 'online';

        const finalStatus = order.saleInHand ? 'delivered' : 'ordered';

        // Update Order in DB
        await orderModel.updateOne(
          { orderId: paymentLinkId },
          {
            $set: {
              'paymentDetails.paymentId': razorpayPaymentId,
              'paymentDetails.payment_status': 'success',
              'paymentDetails.payment_method_type': paymentMethod,
              'paymentDetails.fullDetails': paymentLinkDetails,
              order_status: finalStatus,
              updatedAt: new Date(),
            },
            $push: { statusUpdates: { status: finalStatus, timestamp: new Date() } },
          }
        );

        // Cart clear pannudhu
        await addToCartModel.deleteMany({ userId: order.userId });

        // Decrement product availability directly from order details
        for (const item of (order.productDetails || [])) {
          await productModel.findByIdAndUpdate(
            item.productId,
            { $inc: { availability: -item.quantity } }
          );
        }

        // 🔥 Trigger Zoho Process
        const fullOrder = await orderModel.findOne({ orderId: paymentLinkId });
        const customerUser = await userModel.findById(fullOrder.userId);
        const staffUser = { role: "MANAGESALES", name: "SYSTEM-CRON" };

        await createSalesOrderAndReleaseStock(fullOrder, customerUser, staffUser);

        // Send confirmation emails
        try {
          await Promise.all([
            sendOrderConfirmationEmailLink(customerUser, razorpayPaymentId, fullOrder),
            sendAdminNotificationEmail(fullOrder),
          ]);
        } catch (emailErr) {
          console.error('Error sending cron emails:', emailErr.message);
        }

        console.log(`✅ Payment Link order ${paymentLinkId} fulfilled successfully!`);
      }
    }
  } catch (err) {
    console.error('Error in Payment Link Cron:', err.message);
  }
});
const sendOrderConfirmationEmailLink = async (customerInfo, razorpayPaymentId, order) => {
  try {
    const payment = await verifyPaymentStatus(razorpayPaymentId);

    if (!payment || !payment.isPaymentCaptured) {
      throw new Error('Payment not captured');
    }

    const amountPaid = payment.amount / 100;
    const paymentStatus = payment.status;
    const transactionId = payment.id;
    const paymentType = payment.method ? payment.method.toUpperCase() : 'ONLINE';
    const vpa = payment.upi?.vpa || '';
    const cardType = (paymentType === 'CARD' && payment.card) ? payment.card.type : '';

    const product = order.productDetails?.[0];
    if (!product) {
      throw new Error('Product details not found in the order');
    }

    const extraPaymentRow = vpa
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">UPI ID</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${vpa}</td></tr>`
      : cardType
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Card Type</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${cardType.toUpperCase()} Card</td></tr>`
      : '';

    const serialRow = order.serialNumber ? `
      <tr>
        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Serial Number</td>
        <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
          ${order.serialNumber}
        </td>
      </tr>
    ` : '';

    const mailOptions = {
      from: 'support@reldaindia.com',
      to: order.billing_email,
      subject: `Payment Received - Order #${order.orderId} | RELDA India Pvt Ltd`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top Logo Bar (White Background - 100% Vivid Logo) -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Payment Successful!</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Your order has been placed successfully</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${order.billing_name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Thank you for your payment! We have successfully received payment for your order. Here is your transaction summary:
                      </p>

                      <!-- Order ID Banner -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff5f5; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Order Reference ID</span>
                            <div style="font-size: 18px; font-weight: 800; color: #E60000; margin-top: 2px;">#${order.orderId}</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Order & Payment Details Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
                            Order & Payment Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Product</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.productName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Quantity</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.quantity} unit(s)
                          </td>
                        </tr>
                        ${serialRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Transaction ID</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${transactionId}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Method</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${paymentType}
                          </td>
                        </tr>
                        ${extraPaymentRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Status</td>
                          <td style="padding: 10px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              ${paymentStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                        <tr style="background-color: #fff9f9;">
                          <td style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Paid</td>
                          <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                            ₹${Number(amountPaid).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Shipping / Delivery Address</span>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">
                              ${order.shipping_address}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding your order or warranty?
                            </p>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                              Email us: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                        Warm Regards,<br>
                        <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    console.log(`📧 Sending Confirmation Link email to: ${order.billing_email}`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending order confirmation email link:', error.message);
  }
};



 // Define the function to check for pending payments
cron.schedule('*/10 * * * *', async () => {
  try {
    const unpaidOrders = await orderModel.find({
      "paymentDetails.payment_status": "pending",
      reminderSent: false,
      createdAt: { $lte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    for (const order of unpaidOrders) {
      const itemsListHtml = (order.productDetails || []).map(item => `
        <tr>
          <td style="padding: 10px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0;">
            <strong>${item.productName}</strong>
          </td>
          <td style="padding: 10px 14px; font-size: 13px; color: #333; text-align: center; border-bottom: 1px solid #f0f0f0;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 14px; font-size: 13px; color: #111; font-weight: 600; text-align: right; border-bottom: 1px solid #f0f0f0;">
            ₹${Number(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
          </td>
        </tr>
      `).join('');

      const mailOptions = {
        from: 'support@reldaindia.com',
        to: order.billing_email,
        subject: `Complete Your Order #${order.orderId} | RELDA India Pvt Ltd`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
              <tr>
                <td align="center">
                  
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                    
                    <!-- Top Logo Bar -->
                    <tr>
                      <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                        <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                      </td>
                    </tr>

                    <!-- Red Hero Banner -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Don't Miss Out!</h1>
                        <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Your favorite items are waiting in your cart</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 30px 25px;">
                        
                        <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                          Hello ${order.billing_name},
                        </p>
                        <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                          We noticed you added items to your cart but haven't finished checking out yet. Complete your order now before stock runs out:
                        </p>

                        <!-- Items Table -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                          <tr style="background-color: #fafbfc;">
                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: left; border-bottom: 1px solid #eef0f2;">Product</th>
                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: center; border-bottom: 1px solid #eef0f2;">Qty</th>
                            <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: right; border-bottom: 1px solid #eef0f2;">Price</th>
                          </tr>
                          ${itemsListHtml}
                          <tr style="background-color: #fff9f9;">
                            <td colspan="2" style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Amount:</td>
                            <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                              ₹${Number(order.totalAmount).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </table>

                        <!-- CTA Button -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 26px;">
                          <tr>
                            <td align="center">
                              <a href="https://www.reldaindia.com/checkout" style="background-color: #E60000; color: #ffffff; text-decoration: none; padding: 15px 36px; border-radius: 30px; font-size: 15px; font-weight: 800; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(230,0,0,0.3);">
                                COMPLETE YOUR PURCHASE →
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Support Info -->
                        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 16px 18px;">
                              <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                                Need help completing your order?
                              </p>
                              <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                                Contact our team: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                              </p>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                          Warm Regards,<br>
                          <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                        </p>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                        <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                          © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #666;">
                          <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                        </p>
                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `
      };

      await transporter.sendMail(mailOptions);
      order.reminderSent = true;
      await order.save();
      console.log(`📧 Cart reminder email sent to: ${order.billing_email}`);
    }
  } catch (error) {
    console.error("Error sending reminder emails:", error.message);
  }
});
// Verify Payment after redirect
const verifyPayment = async (razorpayPaymentId) => {
    try {
        const response = await axios.get(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
            timeout: 8000, // ⛔ prevents infinite hang
            auth: {
                username: process.env.RAZORPAY_KEY_ID,
                password: process.env.RAZORPAY_KEY_SECRET
            }
        });

        const paymentDetails = response.data;
        console.log(paymentDetails);
        

        // Extract specific payment method details
        const isPaymentCaptured = paymentDetails.status === 'captured';
        const paymentMethod = paymentDetails.method; // Razorpay payment method // Fallback if `method` isn't populated

        return { isPaymentCaptured, paymentMethod, paymentDetails};
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw new Error("Error verifying payment");
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpayPaymentId, cartItems, customerInfo, razorpayOrderId } = req.body;

    // Check required fields
    if (!razorpayPaymentId || !razorpayOrderId || !cartItems || !cartItems.length || !customerInfo) {
        return res.status(400).json({
            success: false,
            message: 'Required fields missing or invalid'
        });
    }

    // Ensure user is authenticated
    if (!req.userId) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }

    try {
        // Step 1: Verify payment status
        const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);
        console.log('Payment Details:', paymentDetails);

        if (isPaymentCaptured) {
            // Step 2: Fetch the order by orderId
            const order = await orderModel.findOne({ orderId: razorpayOrderId });
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found.'
                });
            }

            // Step 3: Check if 'ordered' status already exists in the statusUpdates array
            const statusExists = order.statusUpdates.some(update => update.status === 'ordered');
            if (!statusExists) {
                // Step 4: Update order and add 'ordered' status
                const updatedAt = new Date();  // Get the current timestamp for both main document and status update
                await orderModel.findOneAndUpdate(
                    { orderId: razorpayOrderId },
                    {
                        $set: {
                            'paymentDetails.paymentId': razorpayPaymentId,
                            'paymentDetails.payment_status': 'success',
                            'paymentDetails.payment_method_type': paymentMethod,
                            'paymentDetails.fullDetails': paymentDetails,
                            'order_status': 'ordered',
                            updatedAt: updatedAt,  // Set updatedAt here for the main order document
                        },
                        $push: {
                            statusUpdates: {
                                status: 'ordered',
                                timestamp: updatedAt,  // Set timestamp for the 'ordered' status update
                            },
                        },
                    }
                );

                // Step 5: Clear cart after successful payment
                await addToCartModel.deleteMany({ userId: req.userId });
                console.log("Cart has been cleared.");
            } else {
                console.log("The 'ordered' status already exists.");
            }

            // Step 6: Calculate delivery date (4 days from now)
            const deliveryDate = moment().add(4, 'days').toDate();

            // Step 7: Update the order with delivery date
            await orderModel.updateOne(
                { orderId: razorpayOrderId },
                { $set: { delivered_at: deliveryDate } }
            );

            // Step 8: Parallelize product availability update and email sending
            const emailPromises = [
                sendOrderConfirmationEmail(customerInfo, razorpayPaymentId, order),
                sendAdminNotificationEmail(order)
            ];

            // const productUpdatePromises = cartItems.map((item) =>
            //     productModel.findByIdAndUpdate(
            //         item.productId._id,
            //         { $inc: { availability: -1 } },
            //         { new: true }
            //     )
            // );

            
            // 🔥 FETCH UPDATED ORDER & USER
          //  const fullOrder = await orderModel.findOne({ orderId: razorpayOrderId });
          //   const user = await userModel.findById(fullOrder.userId);

          //   await createSalesOrderAndReleaseStock(fullOrder, user);
         const fullOrder = await orderModel.findOne({ orderId: razorpayOrderId });
const customerUser = await userModel.findById(fullOrder.userId);
const staffUser = req.user; // role = MANAGESALES

await createSalesOrderAndReleaseStock(
  fullOrder,
  customerUser,
  staffUser
);




            // Handle potential errors in parallel promises
            try {
                await Promise.all([...emailPromises]);
            } catch (err) {
                console.error('Error processing parallel tasks:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error processing parallel tasks',
                });
            }

            return res.json({
                success: true,
                message: 'Payment successful and order confirmed.',
                paymentMethod,
            });
        } else {
            // Step 9: Handle payment failure and send cart reminder
            await sendCartReminder(customerInfo, cartItems);
            return res.status(400).json({
                success: false,
                message: 'Payment failed. Reminder sent to complete the purchase.',
            });
        }
    } catch (error) {
        console.error("Error in verifyPayment:", error.message || error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const sendOrderConfirmationEmail = async (customerInfo, razorpayPaymentId, order) => {
  try {
    const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);

    if (!isPaymentCaptured) {
      throw new Error('Payment not captured');
    }

    const amountPaid = paymentDetails.amount / 100;
    const paymentStatus = paymentDetails.status;
    const transactionId = paymentDetails.id;
    const paymentType = paymentMethod ? paymentMethod.toUpperCase() : 'ONLINE';
    const vpa = paymentDetails.upi?.vpa || '';
    const cardType = (paymentType === 'CARD' && paymentDetails.card) ? paymentDetails.card.type : '';

    const product = order.productDetails && order.productDetails[0];
    if (!product) {
      throw new Error('Product details not found in the order');
    }

    const extraPaymentRow = vpa
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">UPI ID</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${vpa}</td></tr>`
      : cardType
      ? `<tr><td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Card Type</td><td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">${cardType.toUpperCase()} Card</td></tr>`
      : '';

    const serialRow = order.serialNumber ? `
      <tr>
        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Serial Number</td>
        <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
          ${order.serialNumber}
        </td>
      </tr>
    ` : '';

    const mailOptions = {
      from: 'support@reldaindia.com',
      to: order.billing_email,
      subject: `Order Confirmation - #${order.orderId} | RELDA India Pvt Ltd`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top Logo Bar (White Background - 100% Vivid Logo) -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">Order Placed!</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Thank you for shopping with RELDA</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${order.billing_name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Your payment has been successfully processed! We're preparing your order for shipment. Here are the order details:
                      </p>

                      <!-- Order ID Banner -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff5f5; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Order Reference ID</span>
                            <div style="font-size: 18px; font-weight: 800; color: #E60000; margin-top: 2px;">#${order.orderId}</div>
                          </td>
                        </tr>
                      </table>

                      <!-- Order Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
                            Order Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Product Name</td>
                          <td style="padding: 12px 16px; color: #111; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.productName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Quantity</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: bold; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product.quantity} unit(s)
                          </td>
                        </tr>
                        ${serialRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Transaction ID</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${transactionId}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Method</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${paymentType}
                          </td>
                        </tr>
                        ${extraPaymentRow}
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Payment Status</td>
                          <td style="padding: 10px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              ${paymentStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                        <tr style="background-color: #fff9f9;">
                          <td style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Amount Paid</td>
                          <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 20px; text-align: right;">
                            ₹${Number(amountPaid).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Shipping / Delivery Address</span>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">
                              ${order.shipping_address}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding your order or warranty?
                            </p>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                              Email us: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                        Warm Regards,<br>
                        <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    console.log(`📧 Sending Online Order confirmation email to: ${order.billing_email}`);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending online order confirmation email:', error.message);
  }
};





const sendAdminNotificationEmail = async (order) => {
  try {
    const productRows = (order.productDetails || []).map((p, idx) => `
      <tr>
        <td style="padding: 10px 14px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f0f0;">
          ${idx + 1}. <strong>${p.productName}</strong>
          ${p.serialNumber ? `<br><span style="font-size: 11px; color: #888; font-family: monospace;">Serial: ${p.serialNumber}</span>` : ''}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; color: #333; text-align: center; border-bottom: 1px solid #f0f0f0;">
          ${p.quantity}
        </td>
        <td style="padding: 10px 14px; font-size: 13px; color: #111; font-weight: 600; text-align: right; border-bottom: 1px solid #f0f0f0;">
          ₹${Number(p.sellingPrice * p.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: 'support@reldaindia.com',
      to: 'admin@reldaindia.com',
      subject: `🚨 New Order Alert: #${order.orderId} - ₹${Number(order.totalAmount).toLocaleString('en-IN')}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top Logo Bar -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 22px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 160px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Admin Alert Header -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 25px; text-align: left; border-left: 6px solid #E60000;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
                        ⚡ New Order Received - <span style="color: #ff4d4d;">#${order.orderId}</span>
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        Processed: ${moment().format('DD MMM YYYY, hh:mm A')}
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 25px;">
                      
                      <!-- Customer Information Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Customer Details
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Name:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 700; font-size: 13px; text-align: right;">${order.billing_name}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Email:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 600; font-size: 13px; text-align: right;">
                            <a href="mailto:${order.billing_email}" style="color: #E60000; text-decoration: none;">${order.billing_email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Phone:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 600; font-size: 13px; text-align: right;">
                            <a href="tel:${order.billing_tel}" style="color: #111; text-decoration: none;">${order.billing_tel}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Payment Status:</td>
                          <td style="padding: 8px 14px; text-align: right;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                              ${(order.paymentDetails?.payment_status || 'PAID').toUpperCase()}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 14px; color: #666; font-size: 13px;">Payment Mode:</td>
                          <td style="padding: 8px 14px; color: #111; font-weight: 600; font-size: 13px; text-align: right;">
                            ${order.paymentDetails?.payment_method_type || 'N/A'}
                          </td>
                        </tr>
                      </table>

                      <!-- Ordered Items Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
                        <tr style="background-color: #fafbfc;">
                          <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: left; border-bottom: 1px solid #eef0f2;">Item</th>
                          <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: center; border-bottom: 1px solid #eef0f2;">Qty</th>
                          <th style="padding: 10px 14px; font-size: 11px; font-weight: 800; color: #555; text-transform: uppercase; text-align: right; border-bottom: 1px solid #eef0f2;">Amount</th>
                        </tr>
                        ${productRows}
                        <tr style="background-color: #fff9f9;">
                          <td colspan="2" style="padding: 12px 14px; font-size: 14px; font-weight: 700; color: #111;">Total Order Value:</td>
                          <td style="padding: 12px 14px; font-size: 18px; font-weight: 800; color: #E60000; text-align: right;">
                            ₹${Number(order.totalAmount).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 12px 14px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase;">Shipping Address:</span>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #333; line-height: 1.5;">${order.shipping_address}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        This is an automated system notification from RELDA India Pvt Ltd Order Engine.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. Admin Portal.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Admin notification email sent for order: #${order.orderId}`);
  } catch (error) {
    console.error('Error sending admin notification email:', error.message);
  }
};
// Function to send email
const sendEmail = async (email, subject, message) => {
    if (!email) {
      console.error('Error: No recipient email provided');
      return; // Exit early if email is missing
    }
    try {
      await transporter.sendMail({
        from: 'admin@reldaindia.com', // Sender's email
        to: email, // Receiver's email
        subject: subject,
        html: message,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

exports.updateOrderStatus = async (req, res) => {
  const { orderId, order_status } = req.body;

  try {
    /* -------------------- VALIDATION -------------------- */
    const validStatuses = [
      'pending',
      'ordered',
      'packaged',
      'shipped',
      'delivered',
      'failed',
      'returnRequested',
      'returnAccepted',
      'returned',
    ];

    const validTransitions = {
      ordered: ['packaged'],
      packaged: ['shipped'],
      shipped: ['delivered', 'returnRequested'],
      returnRequested: ['returnAccepted'],
      returnAccepted: ['returned'],
      returned: [],
      delivered: [],
      failed: [],
    };

    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid status provided.',
      });
    }

    const order = await orderModel.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        status: 'failed',
        message: 'Order not found.',
      });
    }

    const currentStatus = order.order_status;
    const allowedStatuses = validTransitions[currentStatus] || [];

    if (!allowedStatuses.includes(order_status)) {
      return res.status(400).json({
        status: 'failed',
        message: `Cannot change status from '${currentStatus}' to '${order_status}'.`,
      });
    }

      /* -------- RETURN ACCEPTED → CREATE SALES RETURN -------- */
/* -------- RETURN ACCEPTED → CREATE SALES RETURN -------- */
if (order_status === "returnAccepted") {

  if (!order.zohoSalesOrderId) {
    throw new Error("Zoho Sales Order ID missing");
  }

  if (!order.zohoSalesReturnId) {

    const so = await getZohoSalesOrder(order.zohoSalesOrderId);

    if (!so?.salesorder_id) {
      throw new Error("Zoho salesorder_id missing from Zoho response");
    }

    console.log("🧾 ZOHO SO DATA:", so);

    const salesReturn = await createZohoSalesReturn({
      salesorder_id: so.salesorder_id,
      location_id: so.location_id,
      line_items: so.line_items.map(li => ({
        item_id: li.item_id,
        salesorder_item_id: li.salesorder_item_id,
        quantity: li.quantity
      }))
    });

    order.zohoSalesReturnId = salesReturn.salesreturn_id;
    await order.save();

    console.log("✅ SALES RETURN CREATED:", salesReturn.salesreturn_id);
  }
}

    /* -------------------- UPDATE ORDER -------------------- */
    order.order_status = order_status;
    const statusUpdatedAt = Date.now();
    order.statusUpdatedAt = statusUpdatedAt;

    order.statusUpdates.push({
      status: order_status,
      updatedAt: statusUpdatedAt,
    });

    await order.save();

    /* -------------------- EMAIL LOGIC -------------------- */
    const formattedTimestamp = moment(statusUpdatedAt).format('hh:mm A');

    let emailSubject = '';
    let emailMessage = '';
//  if (order_status === "returnAccepted") {
//       subject = "Return Request Accepted";
//       message = `
//         <p>Dear <strong>${order.billing_name}</strong>,</p>
//         <p>Your return request for order <b>${order.orderId}</b> has been accepted.</p>
//         <p>Our team will contact you shortly.</p>
//       `;
//     }
    switch (order_status) {
      case 'packaged':
        emailSubject = 'Your Order is Packed and Ready for Shipping';
        emailMessage = `
          <p>Dear <strong>${order.billing_name}</strong>,</p>
          <p>Your order has been packed and is ready for shipping.</p>
          <ul>
            <li><strong>Product</strong>: ${order.productDetails[0]?.productName || 'Your product'}</li>
            <li><strong>Order No</strong>: ${order.orderId}</li>
            <li><strong>Status Updated</strong>: ${formattedTimestamp}</li>
          </ul>
          <p>Thank you for shopping with Relda India.</p>
        `;
        break;

      case 'shipped':
        emailSubject = 'Your Product Has Been Shipped';
        emailMessage = `
          <p>Dear <strong>${order.billing_name}</strong>,</p>
          <p>Your product has been shipped.</p>
          <ul>
            <li><strong>Order No</strong>: ${order.orderId}</li>
            <li><strong>Status Updated</strong>: ${formattedTimestamp}</li>
          </ul>
          <p>You can track your shipment using the tracking information provided.</p>
        `;
        break;

      case 'delivered':
        emailSubject = 'Order Delivered Successfully';
        emailMessage = `
          <p>Dear <strong>${order.billing_name}</strong>,</p>
          <p>Your order has been delivered successfully.</p>
          <ul>
            <li><strong>Order No</strong>: ${order.orderId}</li>
            <li><strong>Delivered At</strong>: ${formattedTimestamp}</li>
          </ul>
          <p>Thank you for your purchase!</p>
        `;
        break;

      case 'returnAccepted':
        emailSubject = 'Return Request Accepted';
        emailMessage = `
          <p>Dear <strong>${order.billing_name}</strong>,</p>
          <p>Your return request for order ${order.orderId} has been accepted.</p>
          <p>Our team will contact you shortly for the return process.</p>
        `;
        break;

      case 'returned':
        emailSubject = 'Order Returned';
        emailMessage = `
          <p>Dear <strong>${order.billing_name}</strong>,</p>
          <p>Your order ${order.orderId} has been returned successfully.</p>
          <p>The refund will be processed within 5-7 business days.</p>
        `;
        break;
    }

    if (order.billing_email && emailSubject) {
      try {
        await sendEmail(order.billing_email, emailSubject, emailMessage, 'html');
        console.log('✅ Notification email sent to:', order.billing_email);
      } catch (emailErr) {
        console.error('❌ Failed to send email:', emailErr.message);
      }
    }

    /* -------------------- RESPONSE -------------------- */
    return res.status(200).json({
      status: 'success',
      message: `Order #${orderId} updated to '${order_status}'.`,
      timestamp: formattedTimestamp,
      statusUpdates: order.statusUpdates,
    });

  } catch (error) {
    console.error('❌ Error in updating order status:', error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.CancelOrder = async (req, res) => {
  const { orderId, cancelReason, customComment } = req.body;

  try {
    const order = await orderModel.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 1️⃣ VOID ZOHO SALES ORDER (if exists)
    if (order.zohoSalesOrderId) {
      await voidZohoSalesOrder(order.zohoSalesOrderId);
    }

    // 2️⃣ UPDATE LOCAL ORDER
    order.order_status = "cancelled";
    order.cancellationReason = cancelReason || "";
    order.customComment = customComment || "";

    order.statusUpdates.push({
      status: "cancelled",
      updatedAt: new Date()
    });

    // 3️⃣ RESTORE STOCK
    for (const item of order.productDetails) {
      await productModel.findByIdAndUpdate(
        item.productId,
        { $inc: { availability: item.quantity } }
      );
    }

    await order.save();

    return res.status(200).json({
      status: "success",
      message: "Order cancelled successfully"
    });

  } catch (err) {
    console.error("❌ Cancel Order Error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Cancel failed" });
  }
};
  async function sendCancellationEmail(order, cancelReason, customComment) {
    // Prepare the email content for the customer
    const customerEmailContent = `
    Dear ${order.billing_name},
  
    Your order with ID: ${order.orderId} has been successfully cancelled.
  
    Cancellation Reason: ${cancelReason}
    ${customComment ? 'Additional Comment: ' + customComment : ''}
  
    If you have any questions, feel free to contact us.
  
    Best regards,
    The RELDA India Team
  `;
  
    // Prepare the email content for the admin
    const adminEmailContent = `
    Order Cancellation Notification:
  
    Order ID: ${order.orderId}
    Customer Name: ${order.billing_name}
    Customer Email: ${order.billing_email}
  
    Cancellation Reason: ${cancelReason}
    ${customComment ? 'Additional Comment: ' + customComment : ''}
  
    Please review the order cancellation and take any necessary actions.
  
    Best regards,
    The RELDA India Team
  `;
  
    // Email options for the customer
  const customerMailOptions = {
    from: 'admin@reldaindia.com',
    to: `${order.billing_email}`, // Customer's email
    subject: 'Order Cancellation Notification',
    text: customerEmailContent, // Customer email content
  };

  // Email options for the admin
  const adminMailOptions = {
    from: 'support@reldaindia.com',
    to: 'admin@reldaindia.com', // Admin email
    subject: 'Order Cancellation Notification',
    text: adminEmailContent, // Admin email content
  };

  try {
    // Send email to the customer
    await transporter.sendMail(customerMailOptions);

    // Send email to the admin
    await transporter.sendMail(adminMailOptions);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
}

exports.deletePendingOrderById = async (req, res) => {
    const { orderId } = req.query;  // Capture the orderId from the query parameter

    if (!orderId) {
        return res.status(400).json({
            success: false,
            message: 'Order ID is required'
        });
    }

    try {
        // Find and delete the order only if its status is 'pending'
        const deletedOrder = await orderModel.deleteOne({
            orderId: orderId,
            order_status: 'Pending',  // Ensure only pending orders are deleted
        });

        if (deletedOrder.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pending order not found or already processed.'
            });
        }

        res.json({
            success: true,
            message: `Pending order with ID ${orderId} deleted successfully.`,
        });
    } catch (error) {
        console.error("Error deleting pending order:", error.message || error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


 