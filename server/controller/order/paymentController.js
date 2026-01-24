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
//         const { cartItems, customerInfo, billingSameAsShipping, usePaymentLink, paymentMode  } = req.body;
// // 💰 CASH ON HAND FLOW
// if (paymentMode === "CASH_ON_HAND") {

//   const subTotal = cartItems.reduce((t, i) =>
//     t + i.quantity * i.productId.sellingPrice, 0
//   );

//   const order = await orderModel.create({
//     orderId: `CASH-${uuidv4().slice(0, 8)}`,
//     productDetails: cartItems.map(item => ({
//       productId: item.productId._id,
//       productName: item.productId.productName,
//       quantity: item.quantity,
//       sellingPrice: item.productId.sellingPrice,
//       // productImage: item.productId.productImage[0],
//       productImage: getProductImageUrl(item.productId.productImage),

//     })),
//     email: customerInfo.email,
//     userId: req.userId,
//     totalAmount: subTotal,
//     paymentDetails: {
//       payment_status: "cash_on_hand",
//       payment_method_type: "CASH"
//     },
//     billing_address: customerInfo.street,
//     shipping_address: customerInfo.street,
//     statusUpdates: [{
//       status: "ORDER_CONFIRMED",
//       updatedAt: new Date()
//     }],
//     createdAt: new Date()
//   });

//   return res.json({
//     success: true,
//     message: "Order confirmed with Cash on Hand",
//     orderId: order.orderId
//   });
// }

//         if (!customerInfo || typeof customerInfo !== 'object') {
//             return res.status(400).json({ message: "Invalid customer information", success: false });
//         }

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

//         const user = await userModel.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

//         // const totalAmount = cartItems.reduce((total, item) => {
//         //     return total + item.quantity * item.productId.sellingPrice;
//         // }, 0) * 100;

//         let subTotal = cartItems.reduce((total, item) => {
//   return total + item.quantity * item.productId.sellingPrice;
// }, 0);

// let discountAmount = 0;
// let appliedCoupon = null;

// if (req.body.couponCode) {
//   const coupon = await Coupon.findOne({
//     code: req.body.couponCode.toUpperCase(),
//     isActive: true
//   });

//   if (!coupon) {
//     return res.status(400).json({ success: false, message: "Invalid coupon" });
//   }

//   if (coupon.expiryDate && coupon.expiryDate < new Date()) {
//     return res.status(400).json({ success: false, message: "Coupon expired" });
//   }

//   if (subTotal < coupon.minOrderAmount) {
//     return res.status(400).json({
//       success: false,
//       message: `Minimum order ₹${coupon.minOrderAmount}`
//     });
//   }

//   discountAmount =
//     coupon.discountType === "percentage"
//       ? (subTotal * coupon.discountValue) / 100
//       : coupon.discountValue;

//   if (coupon.maxDiscountAmount) {
//     discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
//   }

//   appliedCoupon = {
//     code: coupon.code,
//     discountAmount: discountAmount
//   };
// }

// // FINAL AMOUNT
// const finalAmount = Math.max(subTotal - discountAmount, 0);
// const totalAmount = finalAmount * 100;


//         const receiptId = `order_rcptid_${uuidv4().slice(0, 8)}`;

//         // ?? PAYMENT ORDER OR LINK
//         let paymentResponse;
//         let orderIdOrLink;

//         if (usePaymentLink) {
//             // ?? Create Payment Link
//             paymentResponse = await razorpay.paymentLink.create({
//                 amount: totalAmount,
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
//                 callback_url: "http://yourwebsite.com/payment/verify",
//                 callback_method: "get"
//             });

//             if (!paymentResponse || !paymentResponse.id) {
//                 throw new Error("Failed to create Razorpay Payment Link");
//             }

//             orderIdOrLink = paymentResponse.id;

//         } else {
//             // ?? Create Razorpay Order
//             const options = {
//                 amount: totalAmount,
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

//         const existingOrder = await orderModel.findOne({ orderId: orderIdOrLink });
//         if (existingOrder) {
//             if (!existingOrder.statusUpdates.some(status => status.status === statusId)) {
//                 existingOrder.statusUpdates.push({
//                     status: statusId,
//                     updatedAt: new Date()
//                 });
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
//                     // productImage: item.productId.productImage[0],
//                     productImage: getProductImageUrl(item.productId.productImage),

//                 })),
//                 email: user.email,
//                 userId: req.userId,
//                 totalAmount: totalAmount / 100,
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
//                 statusUpdates: [{
//                     status: statusId,
//                     updatedAt: new Date()
//                 }],
//                 createdAt: new Date(),
//             });
//         }

//         // ? Return correct response
//         res.json({
//             success: true,
//             mode: usePaymentLink ? 'link' : 'order',
//             orderId: orderIdOrLink,
//             amount: totalAmount,
//             currency: "INR",
//             customerInfo,
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
exports.paymentController = async (req, res) => {
    try {
        const { cartItems, customerInfo, billingSameAsShipping, usePaymentLink, paymentMode, couponCode } = req.body;
        
        // Validate customer info first
        if (!customerInfo || typeof customerInfo !== 'object') {
            return res.status(400).json({ message: "Invalid customer information", success: false });
        }

        // Calculate subtotal first (for all payment modes)
        let subTotal = cartItems.reduce((total, item) => {
            return total + item.quantity * item.productId.sellingPrice;
        }, 0);
        
        // Apply coupon logic (for all payment modes)
        let discountAmount = 0;
        let appliedCoupon = null;
        
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase(),
                isActive: true
            });
            
            if (!coupon) {
                return res.status(400).json({ success: false, message: "Invalid coupon" });
            }
            
            if (coupon.expiryDate && coupon.expiryDate < new Date()) {
                return res.status(400).json({ success: false, message: "Coupon expired" });
            }
            
            if (subTotal < coupon.minOrderAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order ₹${coupon.minOrderAmount}`
                });
            }
            
            discountAmount = coupon.discountType === "percentage"
                ? (subTotal * coupon.discountValue) / 100
                : coupon.discountValue;
            
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
            
            appliedCoupon = {
                code: coupon.code,
                discountAmount: discountAmount
            };
        }
        // Calculate final amount after discount
        const finalAmount = Math.max(subTotal - discountAmount, 0);

        // Prepare addresses
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

        // 💰 CASH ON HAND FLOW
        if (paymentMode === "CASH_ON_HAND") {
            const order = await orderModel.create({
                orderId: `CASH-${uuidv4().slice(0, 8)}`,
                productDetails: cartItems.map(item => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    brandName: item.productId.brandName,
                    category: item.productId.category,
                    quantity: item.quantity,
                    price: item.productId.price,
                    sellingPrice: item.productId.sellingPrice,
                    productImage: getProductImageUrl(item.productId.productImage),
                })),
                email: customerInfo.email,
                userId: req.userId,
                subTotal: subTotal,
                discountAmount: discountAmount || 0,
                couponCode: appliedCoupon?.code || null,
                totalAmount: finalAmount,
                paymentDetails: {
                    payment_status: "cash_on_hand",
                    payment_method_type: "CASH"
                },
                billing_name: customerInfo.firstName,
                billing_email: customerInfo.email,
                billing_tel: customerInfo.phone,
                billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
                shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
                statusUpdates: [{
                    status: "ORDER_CONFIRMED",
                    updatedAt: new Date()
                }],
                createdAt: new Date()
            });
            const user = await userModel.findById(req.userId);

// await createSalesOrderAndReleaseStock(order, user);
const fullOrder = await orderModel.findOne(order.orderId);
const customerUser = await userModel.findById(fullOrder.userId);
const staffUser = req.user; // role = MANAGESALES

await createSalesOrderAndReleaseStock(
  fullOrder,
  customerUser,
  staffUser
);


   // ✅ MARK COUPON USED (ONLY HERE)
      if (couponCode) {
        await markCouponAsUsed({
          coupon: couponCode,
          userId: req.userId,
          orderId: order.orderId
        });
      }
            return res.json({
                success: true,
                message: "Order confirmed with Cash on Hand",
                orderId: order.orderId,
                totalAmount: finalAmount,
                discountAmount: discountAmount,
                couponCode: appliedCoupon?.code || null
            });
        }

        // 💳 ONLINE PAYMENT FLOW (Razorpay)
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Convert to paise for Razorpay
        const totalAmountInPaise = finalAmount * 100;
        const receiptId = `order_rcptid_${uuidv4().slice(0, 8)}`;

        // Create Payment Order or Link
        let paymentResponse;
        let orderIdOrLink;

        if (usePaymentLink) {
            // Create Payment Link
            paymentResponse = await razorpay.paymentLink.create({
                amount: totalAmountInPaise,
                currency: "INR",
                accept_partial: false,
                description: "Purchase from Online Store",
                customer: {
                    name: customerInfo.firstName,
                    contact: customerInfo.phone,
                    email: customerInfo.email,
                },
                notify: {
                    sms: true,
                    email: true
                },
                reminder_enable: true,
                callback_url: "http://yourwebsite.com/payment/verify",
                callback_method: "get"
            });

            if (!paymentResponse || !paymentResponse.id) {
                throw new Error("Failed to create Razorpay Payment Link");
            }

            orderIdOrLink = paymentResponse.id;

        } else {
            // Create Razorpay Order
            const options = {
                amount: totalAmountInPaise,
                currency: "INR",
                receipt: receiptId,
                payment_capture: 1
            };

            paymentResponse = await razorpay.orders.create(options);
            if (!paymentResponse || !paymentResponse.id) {
                throw new Error("Failed to create Razorpay order.");
            }

            orderIdOrLink = paymentResponse.id;
        }

        const statusId = `pending-${req.userId}-${uuidv4()}`;

        // Check if order exists and update or create new
        const existingOrder = await orderModel.findOne({ orderId: orderIdOrLink });
        
        if (existingOrder) {
            if (!existingOrder.statusUpdates.some(status => status.status === statusId)) {
                existingOrder.statusUpdates.push({
                    status: statusId,
                    updatedAt: new Date()
                });
                
                // Update discount info if it changed
                existingOrder.discountAmount = discountAmount || 0;
                existingOrder.couponCode = appliedCoupon?.code || null;
                existingOrder.subTotal = subTotal;
                existingOrder.totalAmount = finalAmount;
                
                await existingOrder.save();
            }
        } else {
            await orderModel.create({
                orderId: orderIdOrLink,
                productDetails: cartItems.map(item => ({
                    productId: item.productId._id,
                    brandName: item.productId.brandName,
                    productName: item.productId.productName,
                    category: item.productId.category,
                    quantity: item.quantity,
                    price: item.productId.price,
                    availability: item.productId.availability,
                    sellingPrice: item.productId.sellingPrice,
                    productImage: getProductImageUrl(item.productId.productImage),
                })),
                email: customerInfo.email,
                userId: req.userId,
                subTotal: subTotal,
                discountAmount: discountAmount || 0,
                couponCode: appliedCoupon?.code || null,
                totalAmount: finalAmount,
                paymentDetails: {
                    paymentId: "",
                    payment_method_type: "",
                    payment_status: "pending",
                },
                billing_name: customerInfo.firstName,
                billing_email: customerInfo.email,
                billing_tel: customerInfo.phone,
                billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
                shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
                statusUpdates: [{
                    status: statusId,
                    updatedAt: new Date()
                }],
                createdAt: new Date(),
            });
        }
         // ✅ MARK COUPON USED (ONLY HERE)
      if (couponCode) {
        await markCouponAsUsed({
          coupon: couponCode,
          userId: req.userId,
          orderId: orderIdOrLink
        });
      }
        // Return response with all payment details
        res.json({
            success: true,
            mode: usePaymentLink ? 'link' : 'order',
            orderId: orderIdOrLink,
            amount: totalAmountInPaise,
            currency: "INR",
            customerInfo,
            subTotal: subTotal,
            discountAmount: discountAmount,
            couponCode: appliedCoupon?.code || null,
            finalAmount: finalAmount,
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


// cron.schedule('* * * * *', async () => {
  cron.schedule('0 */4 * * *', async () => {
  console.log('? Running scheduled Razorpay Payment Link verification...');

  try {
    // Find all pending orders where orderId starts with 'plink_'
    const pendingOrders = await orderModel.find({
      orderId: { $regex: /^plink_/ },
      order_status: 'Pending',
    });

    if (!pendingOrders.length) {
      console.log('?? No pending orders with Razorpay payment links found.');
      return;
    }

    for (const order of pendingOrders) {
      const paymentLinkId = order.orderId;

      // Fetch payment link details dynamically
      const paymentLinkDetails = await verifyPaymentLinkStatus(paymentLinkId);

      if (!paymentLinkDetails) {
        console.log(`?? Could not fetch details for payment link: ${paymentLinkId}`);
        continue;
      }

      if (paymentLinkDetails.status === 'paid') {
        // Extract actual Razorpay payment ID from payments array
        const razorpayPaymentId = paymentLinkDetails.payments?.[0]?.payment_id;

        if (!razorpayPaymentId) {
          console.log(`?? No payment ID found in payment link details for ${paymentLinkId}`);
          continue;
        }

        // Update order in DB
        await orderModel.updateOne(
          { orderId: paymentLinkId },
          {
            $set: {
              'paymentDetails.paymentId': razorpayPaymentId,
              'paymentDetails.payment_status': 'success',
              'paymentDetails.payment_method_type': paymentLinkDetails.payment_method || null,
              'paymentDetails.fullDetails': paymentLinkDetails,
              order_status: 'ordered',
              updatedAt: new Date(),
            },
            $push: { statusUpdates: { status: 'ordered', timestamp: new Date() } },
          }
        );
        console.log(`? Order ${paymentLinkId} updated to ordered status.`);

        // Clear user's cart after order
        await addToCartModel.deleteMany({ userId: order.userId });
        console.log('?? Cart has been cleared.');

        // Set delivery date 4 days from now
        const deliveryDate = moment().add(4, 'days').toDate();
        await orderModel.updateOne({ orderId: paymentLinkId }, { $set: { delivered_at: deliveryDate } });

        try {
          // Send confirmation and admin notification emails & update product stock
          const customerInfo = await userModel.findById(order.userId);
          const cartItems = await addToCartModel.find({ userId: order.userId });

          const emailPromises = [
            sendOrderConfirmationEmailLink(customerInfo, razorpayPaymentId, order),
            sendAdminNotificationEmail(order),
          ];

          const productUpdatePromises = cartItems.map(item =>
            productModel.findByIdAndUpdate(
              item.productId._id,
              { $inc: { availability: -1 } },
              { new: true }
            )
          );
// const fullOrder = await orderModel.findOne({ orderId: paymentLinkId });
// const user = await userModel.findById(fullOrder.userId);

// await createSalesOrderAndReleaseStock(fullOrder, user);
const fullOrder = await orderModel.findOne({ orderId: paymentLinkId });
const customerUser = await userModel.findById(fullOrder.userId);
const staffUser = req.user; // role = MANAGESALES

await createSalesOrderAndReleaseStock(
  fullOrder,
  customerUser,
  staffUser
);


          await Promise.all([...emailPromises, ...productUpdatePromises]);
        } catch (emailOrStockError) {
          console.error('? Error sending emails or updating product stock:', emailOrStockError);
        }
      } else {
        console.log(`?? Order ${paymentLinkId} payment link status: ${paymentLinkDetails.status}`);
      }
    }
  } catch (err) {
    console.error('? Error verifying payment links:', err.response?.data || err.message || err);
  }
});
const sendOrderConfirmationEmailLink = async (customerInfo, razorpayPaymentId, order) => {
  try {
    // Get flat payment object
    const payment = await verifyPaymentStatus(razorpayPaymentId);

    if (!payment || !payment.isPaymentCaptured) {
      throw new Error('Payment not captured');
    }

    // Extract key details
    const amountPaid = payment.amount / 100;  // Convert from paise to INR
    const paymentStatus = payment.status;
    const transactionId = payment.id;
    const paymentType = payment.method || 'Unknown';
    const vpa = payment.upi?.vpa || '';
    const cardType = (paymentType === 'card' && payment.card) ? payment.card.type : '';

    // Construct HTML block
    let paymentDetailsHtml = `
      <ul>
        <li><strong>Amount Paid:</strong> ?${amountPaid}</li>
        <li><strong>Payment Status:</strong> ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}</li>
        <li><strong>Transaction ID:</strong> ${transactionId}</li>
        <li><strong>Payment Method:</strong> ${paymentType}</li>
    `;

    if (paymentType === 'upi' && vpa) {
      paymentDetailsHtml += `<li><strong>UPI ID:</strong> ${vpa}</li>`;
    } else if (paymentType === 'card' && cardType) {
      paymentDetailsHtml += `<li><strong>Card Type:</strong> ${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card</li>`;
    }

    paymentDetailsHtml += `</ul>`;

    const product = order.productDetails?.[0];
    if (!product) {
      throw new Error('Product details not found in the order');
    }

    // Prepare email
    const mailOptions = {
      from: 'admin@reldaindia.com',
      to: order.billing_email,
      subject: 'Payment Confirmation Details',
      html: `
        <p>Dear ${order.billing_name},</p>
        <p>Thank you for your payment! We've successfully received your payment for <strong>${product.productName}</strong>.</p>
        <p><strong>Here are your payment details:</strong></p>
        ${paymentDetailsHtml}
        <p>If you have any questions or need further assistance, please feel free to contact us at <strong>support@reldaindia.com</strong> or <strong>9884890934</strong>. We're always happy to help!</p>
        <p>Best Regards,<br>The Elda Appliances Team</p>
      `
    };

    console.log('Sending confirmation email with:', mailOptions);
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending order confirmation email:', error.message);
  }
};


 // Define the function to check for pending payments
 cron.schedule('*/10 * * * *', async () => {
    try {
        // Fetch unpaid orders where no reminder has been sent
        const unpaidOrders = await orderModel.find({
            "paymentDetails.payment_status": "pending",
            reminderSent: false,
            createdAt: { $lte: new Date(Date.now() - 10 * 60 * 1000) }, // Orders created 10+ minutes ago
        });

        for (const order of unpaidOrders) {
            // Send reminder email
            const mailOptions = {
                from: 'admin@reldaindia.com',
                to: order.billing_email,
                subject: 'Reminder: Complete Your Purchase',
                html: `
                    <h2>Hello ${order.billing_name},</h2>
                    <p>We noticed you added items to your cart but haven't completed the purchase. Here's a summary of your order:</p>
                    <ul>
                        ${order.productDetails.map(item => `
                            <li>
                                <strong>${item.productName}</strong> - ${item.quantity} x &#8377;${item.sellingPrice}
                            </li>`).join('')}
                    </ul>
                    <p><strong>Total Amount:</strong> &#8377;${order.totalAmount}</p>
                    <p>Click <a href="https://www.reldaindia.com">here</a> to complete your payment.</p>
                    <p>If you have any questions, feel free to contact us!</p>
                    <p>Best regards,<br>Your Company</p>
                `,
            };

            await transporter.sendMail(mailOptions);

            // Mark reminder as sent
            order.reminderSent = true;
            await order.save();
        }
    } catch (error) {
        console.error("Error sending reminder emails:", error);
    }
});
// Verify Payment after redirect
const verifyPayment = async (razorpayPaymentId) => {
    try {
        const response = await axios.get(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
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
        // Fetch payment details from Razorpay response
        const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);

        // Check if the payment is captured successfully
        if (!isPaymentCaptured) {
            throw new Error('Payment not captured');
        }

        // Extract relevant information from Razorpay response
        const amountPaid = paymentDetails.amount / 100;  // Razorpay returns the amount in paise, so we divide by 100 to convert to INR
        const paymentStatus = paymentDetails.status;
        const transactionId = paymentDetails.id;
        const paymentType = paymentMethod || 'Unknown';  // UPI, Card, Wallet, etc.
        const vpa = paymentDetails.upi?.vpa || '';  // If UPI payment, extract the VPA (Virtual Payment Address)

        // Initialize the card type variable
        let cardType = '';
        if (paymentType === 'card' && paymentDetails.card) {
            cardType = paymentDetails.card.type;  // This can be 'credit' or 'debit'
        }

        // Log payment details for debugging
        console.log('Payment Details:', paymentDetails); // This helps in confirming the data structure

        // Construct payment details HTML
        let paymentDetailsHtml = `
            <ul>
                <li><strong>Amount Paid:</strong> &#8377;${amountPaid}</li>
                <li><strong>Payment Status:</strong> ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}</li>
                <li><strong>Transaction ID:</strong> ${transactionId}</li>
                <li><strong>Payment Method:</strong> ${paymentType}</li>
        `;

        // If the payment method is UPI, add VPA
        if (paymentType === 'upi' && vpa) {
            paymentDetailsHtml += `
                <li><strong>UPI ID:</strong> ${vpa}</li>
            `;
        } else if (paymentType === 'card' && cardType) {
            // If the payment method is card, show whether it was credit or debit card
            paymentDetailsHtml += `
                <li><strong>Card Type:</strong> ${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card</li>
            `;
        }

        paymentDetailsHtml += `</ul>`;

        // Ensure you access the product from the order if available
        const product = order.productDetails && order.productDetails[0]; // Assuming there is at least one product in productDetails

        if (!product) {
            throw new Error('Product details not found in the order');
        }

        const mailOptions = {
            from: 'admin@reldaindia.com',
            to: order.billing_email,  // Customer's email
            subject: 'Payment Confirmation Details',
            html: `
                <p>Dear ${order.billing_name},</p>
                <p>Thank you for your payment! We've successfully received your payment for ${product.productName}.</p>
                
                <p><strong>Here are your payment details:</strong></p>
                ${paymentDetailsHtml}
                
                <p>If you have any questions or need further assistance, please feel free to contact us at [support@reldaindia.com/9884890934]. We're always happy to help!</p>
                
                <p>Best Regards,<br>The Elda Appliances Team</p>
            `,
        };

        console.log(mailOptions);  // Debugging output to check email content

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};





const sendAdminNotificationEmail = async (order) => {
    try {
        const mailOptions = {
            from: 'support@reldaindia.com',
            to: 'admin@reldaindia.com',  // Admin's email
            subject: `New Order Received - ${order.orderId}`,
            html: `
                <p>Hi Admin,</p>
                <p>A new order has been successfully paid and processed.</p>
                <p><strong>Order Number:</strong> ${order.orderId}</p>
                <p><strong>Customer Name:</strong> ${order.billing_name}</p>
                <p><strong>Total Amount:</strong> ?${order.totalAmount}</p>
                <p><strong>Payment Status:</strong> Success</p>
                <p><strong>Shipping Address:</strong> ${order.shipping_address}</p>
                <p><strong>Billing Address:</strong> ${order.billing_address}</p>
                <p>Please review the order details and proceed with fulfillment.</p>
                <p>Best regards,<br>Elda Appliances</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending admin notification email:', error);
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

// exports.updateOrderStatus = async (req, res) => {
//     const { orderId, order_status } = req.body;

//     try {
//         // Validate the new status
//         const validStatuses = ['pending', 'ordered', 'packaged', 'shipped', 'delivered', 'failed', 'returnAccepted', 'returned'];
//         const validTransitions = {
//             ordered: ['packaged'],
//             packaged: ['shipped'],
//             shipped: ['delivered', 'returnRequested'],
//             returnRequested: ['returnAccepted'], // Add this transition
//             returnAccepted: ['returned'],
//             returned: [], // No further transitions
//             delivered: [], // No further transitions
//             failed: [], // No further transitions
//         };

//         if (!validStatuses.includes(order_status)) {
//             return res.status(400).json({ status: 'failed', message: 'Invalid status provided.' });
//         }

//         // Find the order by ID
//         const order = await orderModel.findOne({ orderId });
//         if (!order) {
//             return res.status(404).json({ status: 'failed', message: 'Order not found.' });
//         }

//         const currentStatus = order.order_status;
//         const allowedStatuses = validTransitions[currentStatus] || [];
//         if (!allowedStatuses.includes(order_status)) {
//             return res.status(400).json({
//                 status: 'failed',
//                 message: `Cannot change status from '${currentStatus}' to '${order_status}'.`,
//             });
//         }

//         // Update order status and timestamp
//         order.order_status = order_status;
//         const statusUpdatedAt = Date.now();
//         order.statusUpdatedAt = statusUpdatedAt;

//         // Push the new status update to the statusUpdates array with timestamp
//         order.statusUpdates.push({
//             status: order_status,
//             updatedAt: statusUpdatedAt,
//         });

//         await order.save();

//         // Format the timestamp into 12-hour format
//         const formattedTimestamp = moment(statusUpdatedAt).format('hh:mm A');

//         // Prepare email content for each case
//         let emailMessage = '';
//         let emailSubject = ''; // Change const to let so that it can be reassigned

//         switch (order_status) {
//             case 'packaged':
//                 emailSubject = 'Your Order is Packed and Ready for Shipping';
//                 emailMessage = `
//                     <p>Dear <strong>${order.billing_name}</strong>,</p>
//                     <p>We're excited to let you know that your order is packed and ready for shipping!</p>
//                     <p>Here are your order details:</p>
//                     <ul>
//                         <li><strong>Product Name</strong>: ${order.productDetails[0].productName}</li>
//                         <li><strong>Order Number</strong>: ${order.orderId}</li>
//                         <li><strong>Estimated Delivery</strong>: ${order.estimatedDeliveryDate || 'Within 4-5 days'}</li>
//                     </ul>
//                     <p>If you have any questions, feel free to contact us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>. We're always happy to help!</p>
//                     <p>Thank you for shopping with Elda Appliances.</p>
//                     <p>Best Regards, <br>The Elda Appliances Team</p>
//                 `;
//                 break;

//             case 'shipped':
//                 emailSubject = 'Your Product Has Been Shipped';
//                 emailMessage = `
//                     <p>Dear <strong>${order.billing_name}</strong>,</p>
//                     <p>Great news! Your product has been shipped and is on its way to you.</p>
//                     <p>Here are the shipping details:</p>
//                     <ul>
//                         <li><strong>Product Name</strong>: ${order.productDetails[0].productName}</li>
//                         <li><strong>Order Number</strong>: ${order.orderId}</li>
//                         <li><strong>Estimated Delivery</strong>: Within 4-5 days</li>
//                     </ul>
//                     <p>If you have any questions, feel free to reach out to us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>. We're always happy to help!</p>
//                     <p>Best Regards, <br>The Elda Appliances Team</p>
//                 `;
//                 break;

//             case 'delivered':
//                 emailSubject = 'Thank You for Your Order!';
//                 emailMessage = `
//                     <p>Dear <strong>${order.billing_name}</strong>,</p>
//                     <p>We're happy to let you know that your ${order.productDetails[0].productName} has been successfully delivered! We hope it brings you joy and meets your expectations.</p>
//                     <p>Order Details:</p>
//                     <ul>
//                         <li><strong>Product</strong>: ${order.productDetails[0].productName}</li>
//                         <li><strong>Delivery Date</strong>: ${new Date().toLocaleDateString()}</li>
//                     </ul>
//                     <p>If you have any questions or need help with your purchase, our customer service team is here for you. Feel free to contact us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>. We're always happy to help!</p>
//                     <p>Thank you for choosing Elda Appliances. We look forward to serving you again!</p>
//                     <p>Best Regards, <br>The Elda Appliances Team</p>
//                 `;
//                 break;

//             case 'returnAccepted':
//                 emailSubject = 'Your Return Request Has Been Accepted';
//                 emailMessage = `
//                     <p>Dear <strong>${order.billing_name}</strong>,</p>
//                     <p>Your return request for order #${order.orderId} has been accepted. We are processing the return and will update you shortly.</p>
//                     <p>If you have any questions or need further assistance, feel free to contact us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>.</p>
//                     <p>Best Regards, <br>The Elda Appliances Team</p>
//                 `;
//                 break;

//             case 'returned':
//                 emailSubject = 'Your Order Has Been Returned';
//                 emailMessage = `
//                     <p>Dear <strong>${order.billing_name}</strong>,</p>
//                     <p>Your order #${order.orderId} has been successfully returned. Thank you for your cooperation.</p>
//                     <p>If you have any further questions, feel free to reach out to us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>.</p>
//                     <p>Best Regards, <br>The Elda Appliances Team</p>
//                 `;
//                 break;
//         }

//         console.log(`Sending email to: ${order.billing_email}`);

//         // Send email if email exists
//         if (order.billing_email) {
//             await sendEmail(order.billing_email, emailSubject, emailMessage, 'html'); // 'text' indicates plain text email
//         } else {
//             console.error(`No email found for order #${orderId}`);
//         }

//         return res.status(200).json({
//             status: 'success',
//             message: `Order #${orderId} updated to '${order_status}'.`,
//             timestamp: formattedTimestamp,
//             statusUpdates: order.statusUpdates,
//         });

//     } catch (error) {
//         console.error('Error in updating order status:', error);
//         return res.status(500).json({ status: 'failed', message: 'Internal server error' });
//     }
// };

// exports.updateOrderStatus = async (req, res) => {
//   const { orderId, order_status } = req.body;

//   try {
//     /* -------------------- VALIDATION -------------------- */
//     const validStatuses = [
//       'pending',
//       'ordered',
//       'packaged',
//       'shipped',
//       'delivered',
//       'failed',
//       'returnRequested',
//       'returnAccepted',
//       'returned',
//     ];

//     const validTransitions = {
//       ordered: ['packaged'],
//       packaged: ['shipped'],
//       shipped: ['delivered', 'returnRequested'],
//       returnRequested: ['returnAccepted'],
//       returnAccepted: ['returned'],
//       returned: [],
//       delivered: [],
//       failed: [],
//     };

//     if (!validStatuses.includes(order_status)) {
//       return res.status(400).json({
//         status: 'failed',
//         message: 'Invalid status provided.',
//       });
//     }

//     const order = await orderModel.findOne({ orderId });
//     if (!order) {
//       return res.status(404).json({
//         status: 'failed',
//         message: 'Order not found.',
//       });
//     }

//     const currentStatus = order.order_status;
//     const allowedStatuses = validTransitions[currentStatus] || [];

//     if (!allowedStatuses.includes(order_status)) {
//       return res.status(400).json({
//         status: 'failed',
//         message: `Cannot change status from '${currentStatus}' to '${order_status}'.`,
//       });
//     }

//     /* -------------------- 🔥 ZOHO LOGIC -------------------- */
// if (order_status === 'packaged') {

//   const salesOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

//   const pkg = await createZohoPackage(salesOrder);

//   const shipment = await createShipmentFromPackage(pkg.package_id);

//   const invoice = await createInvoiceFromShipmentOrder(
//     shipment.shipmentorder_id
//   );

//   order.zohoPackageId = pkg.package_id;
//   order.zohoShipmentOrderId = shipment.shipmentorder_id;
//   order.zohoInvoiceId = invoice.invoice_id;
// }




//     /* -------------------- UPDATE ORDER -------------------- */
//     order.order_status = order_status;

//     const statusUpdatedAt = Date.now();
//     order.statusUpdatedAt = statusUpdatedAt;

//     order.statusUpdates.push({
//       status: order_status,
//       updatedAt: statusUpdatedAt,
//     });

//     await order.save();

//     /* -------------------- EMAIL LOGIC -------------------- */
//     const formattedTimestamp = moment(statusUpdatedAt).format('hh:mm A');

//     let emailSubject = '';
//     let emailMessage = '';

//     switch (order_status) {
//       case 'packaged':
//         emailSubject = 'Your Order is Packed and Ready for Shipping';
//         emailMessage = `
//           <p>Dear <strong>${order.billing_name}</strong>,</p>
//           <p>Your order has been packed and is ready for shipping.</p>
//           <ul>
//             <li><strong>Product</strong>: ${order.productDetails[0].productName}</li>
//             <li><strong>Order No</strong>: ${order.orderId}</li>
//           </ul>
//           <p>Thank you for shopping with Elda Appliances.</p>
//         `;
//         break;

//       case 'shipped':
//         emailSubject = 'Your Product Has Been Shipped';
//         emailMessage = `
//           <p>Dear <strong>${order.billing_name}</strong>,</p>
//           <p>Your product has been shipped.</p>
//         `;
//         break;

//       case 'delivered':
//         emailSubject = 'Order Delivered Successfully';
//         emailMessage = `
//           <p>Dear <strong>${order.billing_name}</strong>,</p>
//           <p>Your order has been delivered successfully.</p>
//         `;
//         break;

//       case 'returnAccepted':
//         emailSubject = 'Return Request Accepted';
//         emailMessage = `
//           <p>Your return request for order ${order.orderId} has been accepted.</p>
//         `;
//         break;

//       case 'returned':
//         emailSubject = 'Order Returned';
//         emailMessage = `
//           <p>Your order ${order.orderId} has been returned successfully.</p>
//         `;
//         break;
//     }

//     if (order.billing_email) {
//       await sendEmail(order.billing_email, emailSubject, emailMessage, 'html');
//     }

//     /* -------------------- RESPONSE -------------------- */
//     return res.status(200).json({
//       status: 'success',
//       message: `Order #${orderId} updated to '${order_status}'.`,
//       timestamp: formattedTimestamp,
//       statusUpdates: order.statusUpdates,
//     });

//   } catch (error) {
//     console.error('❌ Error in updating order status:', error);
//     return res.status(500).json({
//       status: 'failed',
//       message: 'Internal server error',
//     });
//   }
// };

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
          <p>Thank you for shopping with Relda Appliances.</p>
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

// exports.CancelOrder = async (req, res) => {
//     const { orderId, cancelReason, customComment, order_status } = req.body;

//     // Check if all necessary data is provided
//     if (!orderId || !cancelReason || !order_status) {
//         return res.status(400).json({ message: 'Missing required fields.' });
//     }

//     try {
//         // Find the order
//         const order = await orderModel.findOne({ orderId });

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Check if the order is already cancelled
//         if (order.order_status === 'cancelled') {
//             return res.status(400).json({ message: 'Order is already cancelled' });
//         }


//         // Update order status and reason
//         order.order_status = 'cancelled';
//         order.cancellationReason = cancelReason; // Store the cancellation reason
//         order.customComment = customComment || ''; // Store custom comment if provided
//         order.statusUpdates.push({
//             status: 'cancelled',
//             timestamp: new Date(), // Set timestamp for the cancellation status update
//         });

//         // Check if the order contains items
//         const cartItems = order.productDetails || []; // Use the correct field for items

//         if (!Array.isArray(cartItems) || cartItems.length === 0) {
//             return res.status(400).json({ message: 'No items found in the order to cancel.' });
//         }

//         // Increase product availability
//         await Promise.all(
//             cartItems.map(async (item) => {
//                 await productModel.findByIdAndUpdate(
//                     item.productId, // Adjust field based on schema
//                     { $inc: { availability: item.quantity } },
//                     { new: true }
//                 );
//             })
//         );

//         // Save the updated order
//         await order.save();

//         // Send email notification
//         await sendCancellationEmail(order, cancelReason, customComment);

//         return res.status(200).json({ message: 'Order cancelled successfully' });
//     } catch (err) {
//         console.error('Error canceling order:', err);
//         return res.status(500).json({ message: 'An error occurred while canceling the order' });
//     }
// };
  // Function to send email notification
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
    Elda Appliances
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
    Elda Appliances
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


 