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

// Razorpay configuration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
// Payment initiation logic
// exports.paymentController = async (req, res) => {
//     try {
//         const { cartItems, customerInfo, billingSameAsShipping } = req.body;

//         if (!customerInfo || typeof customerInfo !== 'object') {
//             return res.status(400).json({ message: "Invalid customer information", success: false });
//         }

//         // Extract shipping and billing address
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

//         // Fetch the user from the database using the userId from the request
//         const user = await userModel.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false,
//             });
//         }

//         // Calculate total amount in currency's subunit (INR to paise)
//         const totalAmount = cartItems.reduce((total, item) => {
//             return total + item.quantity * item.productId.sellingPrice;
//         }, 0) * 100;  // Razorpay uses smallest currency unit (paise)

//         // Create a new Razorpay order
//         const options = {
//             amount: totalAmount,
//             currency: "INR",
//             receipt: "order_rcptid_11",
//             payment_capture: 1, // Auto-captures payment
//         };

//         // Attempt to create Razorpay order
//         const order = await razorpay.orders.create(options);
//         console.log('Razorpay Order Response:', order);
//         if (!order || !order.id) {
//             throw new Error("Failed to create Razorpay order.");
//         }

//         // Initialize statusUpdates with a valid status
//         const statusUpdates = [{
//             status: "pending",  // Set initial status to 'pending'
//             updatedAt: new Date()
//         }];

//         // Create a new order in the database
//         const newOrder = await orderModel.create({
//             orderId: order.id,
//             productDetails: cartItems.map((item) => ({
//                 productId: item.productId._id,
//                 brandName: item.productId.brandName,
//                 productName: item.productId.productName,
//                 category: item.productId.category,
//                 quantity: item.quantity,
//                 price: item.productId.price,
//                 availability: item.productId.availability,
//                 sellingPrice: item.productId.sellingPrice,
//                 productImage: item.productId.productImage[0],
//             })),
//             email: user.email,
//             userId: req.userId,
//             totalAmount: totalAmount / 100,  // Convert to main currency unit (INR)
//             paymentDetails: {
//                 paymentId: "",
//                 payment_method_type: "",
//                 payment_status: "pending",  // Payment status is initially pending
//             },
//             billing_name: customerInfo.firstName,
//             billing_email: customerInfo.email,
//             billing_tel: customerInfo.phone,
//             billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
//             shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
//             //  statusUpdates : [{
//             //     status: `pending-${req.userId}-${new Date().getTime()}`,  // Ensure unique status per user and time
//             //     updatedAt: new Date()
//             // }],
//             statusUpdates: [{
//                 status: `pending-${req.userId}-${uuidv4()}`,  // Use a UUID for uniqueness
//                 updatedAt: new Date()
//             }],
//               // Add the statusUpdates field with initial 'pending' status
//             createdAt: new Date(),
//         });

//         // Send Razorpay order_id and other info to frontend
//         res.json({
//             success: true,
//             orderId: order.id,
//             amount: totalAmount,
//             currency: "INR",
//             customerInfo,
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
        const { cartItems, customerInfo, billingSameAsShipping, usePaymentLink } = req.body;

        if (!customerInfo || typeof customerInfo !== 'object') {
            return res.status(400).json({ message: "Invalid customer information", success: false });
        }

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

        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const totalAmount = cartItems.reduce((total, item) => {
            return total + item.quantity * item.productId.sellingPrice;
        }, 0) * 100;

        const receiptId = `order_rcptid_${uuidv4().slice(0, 8)}`;

        // ?? PAYMENT ORDER OR LINK
        let paymentResponse;
        let orderIdOrLink;

        if (usePaymentLink) {
            // ?? Create Payment Link
            paymentResponse = await razorpay.paymentLink.create({
                amount: totalAmount,
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
            // ?? Create Razorpay Order
            const options = {
                amount: totalAmount,
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

        const existingOrder = await orderModel.findOne({ orderId: orderIdOrLink });
        if (existingOrder) {
            if (!existingOrder.statusUpdates.some(status => status.status === statusId)) {
                existingOrder.statusUpdates.push({
                    status: statusId,
                    updatedAt: new Date()
                });
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
                    productImage: item.productId.productImage[0],
                })),
                email: user.email,
                userId: req.userId,
                totalAmount: totalAmount / 100,
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

        // ? Return correct response
        res.json({
            success: true,
            mode: usePaymentLink ? 'link' : 'order',
            orderId: orderIdOrLink,
            amount: totalAmount,
            currency: "INR",
            customerInfo,
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

    //     let zohoSalesOrderId = null;

    //     try {
    //       // Fetch user and validate Zoho Account ID
    //       const user = await userModel.findById(order.userId);
    //       if (!user || !user.zohoAccountId) throw new Error("? Cannot find user's Zoho Account ID");

    //       // Parse addresses robustly with defaults
    //       const parseAddress = (addressString = '') => {
    //         const parts = addressString.split(',').map(p => p.trim());
    //         return {
    //           street: parts.slice(0, 2).join(', ') || '',
    //           city: parts[2] || '',
    //           state: parts[3] || '',
    //           postalCode: parts[4] || '',
    //           country: parts[5] || 'India',
    //         };
    //       };

    //       const billing = parseAddress(order.billing_address);
    //       const shipping = parseAddress(order.shipping_address);

    //       // Get cart items for user
    //       const cartItems = await addToCartModel.find({ userId: order.userId });

    //       // Prepare Zoho sales order payload
    //       const salesOrderPayload = {
    //         Subject: `Order from ${user.name}`,
    //         Due_Date: moment().add(4, 'days').format('YYYY-MM-DD'),
    //         Status: 'Created',
    //         Grand_Total: order.totalAmount,
    //         Sub_Total: order.totalAmount,

    //         Billing_Street: billing.street,
    //         Billing_City: billing.city,
    //         Billing_State: billing.state,
    //         Billing_Code: billing.postalCode,
    //         Billing_Country: billing.country,

    //         Shipping_Street: shipping.street,
    //         Shipping_City: shipping.city,
    //         Shipping_State: shipping.state,
    //         Shipping_Code: shipping.postalCode,
    //         Shipping_Country: shipping.country,

    //         Description: `Razorpay Payment ID: ${razorpayPaymentId}`,
    //         Account_Name: { id: user.zohoAccountId },

    //         Product_Details: cartItems.map(item => ({
    //           product: item.zohoProductId,
    //           quantity: item.quantity,
    //           list_price: item.productId?.sellingPrice || item.sellingPrice || 0,
    //         })),
    //       };

    //       const zohoResponse = await sendToZoho('Sales_Orders', salesOrderPayload);

    //       zohoSalesOrderId = zohoResponse?.data?.[0]?.details?.id;

    //       if (zohoSalesOrderId) {
    //         await orderModel.findOneAndUpdate({ orderId: paymentLinkId }, { $set: { zohoSalesOrderId } });
    //         console.log('? Zoho Sales Order Created:', zohoSalesOrderId);
    //       } else {
    //         console.log('?? Zoho Sales Order ID not found in response');
    //       }
    //     } catch (zohoError) {
    //       console.error('? Zoho Sales Order Failed:', zohoError.response?.data || zohoError.message);
    //     }

    //     try {
    //       // Handle Lead conversion & Deal creation in Zoho
    //       const user = await userModel.findById(order.userId);
    //       const cartEntry = await addToCartModel.findOne({ userId: order.userId }).sort({ createdAt: -1 });
    //       const zohoLeadId = cartEntry?.zohoLeadId;

    //       if (!zohoLeadId) throw new Error('No Zoho Lead ID found in cart entry');

    //       const leadInfo = await getLeadById(zohoLeadId);
    //       const email = leadInfo?.Email;
    //       const phone = leadInfo?.Phone;
    //       const ownerId = leadInfo?.Owner?.id;

    //       let zohoContactId = null;
    //       let zohoAccountId = null;
    //       let zohoDealId = null;

    //       const conversionPayload = {
    //         Deal_Name: `Purchase - ${order.orderId}`,
    //         Stage: 'Closed Won',
    //         Amount: order.totalAmount,
    //         Closing_Date: moment().format('YYYY-MM-DD'),
    //       };

    //      let conversionResult = await convertLead(zohoLeadId, conversionPayload);

    // if (conversionResult.success) {
    //   const converted = conversionResult.data;
    //   zohoContactId = converted?.Contacts?.[0]?.id;
    //   zohoAccountId = converted?.Accounts?.[0]?.id;
    //   zohoDealId = converted?.Deals?.[0]?.id;
    //   console.log("? Lead converted successfully.");
    // } else if (
    //   conversionResult.message === "DUPLICATE_LEAD_CONVERSION" ||
    //   conversionResult.message === "Duplicate contacts found"
    // ) {
    //   console.log("?? Duplicate contact found, deleting and retrying conversion...");

    //   // Step 2: Delete all duplicate contacts
    //   await deleteDuplicateContacts({ email, phone });

    //   // Step 3: Retry lead conversion
    //   conversionResult = await convertLead(zohoLeadId, conversionPayload);

    //   if (conversionResult.success) {
    //     const converted = conversionResult.data;
    //     zohoContactId = converted?.Contacts?.[0]?.id;
    //     zohoAccountId = converted?.Accounts?.[0]?.id;
    //     zohoDealId = converted?.Deals?.[0]?.id;
    //     console.log("? Lead converted successfully after duplicate deletion.");
    //   } else {
    //     console.error("? Lead still not converted after deleting duplicates:", conversionResult.message);
    //     // Optionally: Notify admin or log for manual intervention
    //   }
    // } else {
    //   console.error("? Lead conversion failed for other reason:", conversionResult.message);
    // }
          // Update order with Zoho references
        //   await orderModel.findOneAndUpdate(
        //     { orderId: paymentLinkId },
        //     { $set: { zohoAccountId, zohoContactId, zohoDealId } }
        //   );

        //   console.log('?? Order updated with Zoho references.');
        // } catch (err) {
        //   console.error('? Final Zoho Error:', err.response?.data || err.message);
        // }

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

// exports.paymentController = async (req, res) => {
//     try {
//         const { cartItems, customerInfo, billingSameAsShipping } = req.body;

//         // Validate customer info
//         if (!customerInfo || typeof customerInfo !== 'object') {
//             return res.status(400).json({ message: "Invalid customer information", success: false });
//         }

//         // Extract shipping and billing address
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

//         // Fetch the user from the database using the userId from the request
//         const user = await userModel.findById(req.userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false,
//             });
//         }

//         // Find the existing pending order
//         const existingOrder = await orderModel.findOne({
//             userId: req.userId,
//             'paymentDetails.payment_status': 'pending',  // Only look for pending orders
//         });

//         if (existingOrder) {
//             // Find which products remain in the cart after removal
//             const remainingProducts = existingOrder.productDetails.filter(existingProduct =>
//                 cartItems.some(item => item.productId._id.toString() === existingProduct.productId.toString())
//             );

//             if (remainingProducts.length === 0) {
//                 return res.status(400).json({
//                     message: "No valid products in the cart to checkout.",
//                     success: false,
//                 });
//             }

//             // Calculate the total amount for the remaining products
//             const totalAmount = remainingProducts.reduce((total, item) => {
//                 const cartItem = cartItems.find(cartItem => cartItem.productId._id.toString() === item.productId.toString());
//                 return total + cartItem.quantity * cartItem.productId.sellingPrice;
//             }, 0) * 100;  // Convert to paise (smallest currency unit)

//             // Create a new Razorpay order for the remaining products
//             const options = {
//                 amount: totalAmount,
//                 currency: "INR",
//                 receipt: existingOrder.orderId, // Use the existing order ID as receipt
//                 payment_capture: 1, // Auto-captures payment
//             };

//             // Create a new Razorpay order with updated total amount
//             const updatedOrder = await razorpay.orders.create(options);
//             if (!updatedOrder || !updatedOrder.id) {
//                 throw new Error("Failed to create Razorpay order.");
//             }

//             // Update the order in the database
//             existingOrder.productDetails = remainingProducts.map(product => ({
//                 productId: product.productId._id,
//                 brandName: product.productId.brandName,
//                 productName: product.productId.productName,
//                 quantity: product.quantity,
//                 price: product.productId.price,
//                 sellingPrice: product.productId.sellingPrice,
//                 productImage: product.productImage[0],
//             }));
//             existingOrder.totalAmount = totalAmount / 100;  // Convert back to INR
//             existingOrder.statusUpdates.push({
//                 status: `updated-${req.userId}-${new Date().getTime()}`, // Add update status
//                 updatedAt: new Date()
//             });

//             // Save the updated order in the database
//             await existingOrder.save();

//             // Return the updated Razorpay order information to frontend
//             return res.json({
//                 success: true,
//                 message: "Your order has been updated with the remaining product.",
//                 orderId: updatedOrder.id,
//                 totalAmount: totalAmount,
//                 currency: "INR",
//                 customerInfo,
//             });
//         } else {
//             // If no pending order exists, create a new order as usual

//             // Calculate the total amount in currency's subunit (INR to paise)
//             const totalAmount = cartItems.reduce((total, item) => {
//                 return total + item.quantity * item.productId.sellingPrice;
//             }, 0) * 100; // Razorpay uses smallest currency unit (paise)

//             const options = {
//                 amount: totalAmount,
//                 currency: "INR",
//                 receipt: "order_rcptid_11", // Receipt ID, can be anything unique
//                 payment_capture: 1, // Auto-captures payment
//             };

//             // Attempt to create Razorpay order
//             const order = await razorpay.orders.create(options);
//             if (!order || !order.id) {
//                 throw new Error("Failed to create Razorpay order.");
//             }

//             // Initialize statusUpdates with a valid status
//             const statusUpdates = [{
//                 status: "pending",  // Set initial status to 'pending'
//                 updatedAt: new Date()
//             }];

//             // Create a new order in the database
//             const newOrder = await orderModel.create({
//                 orderId: order.id,
//                 productDetails: cartItems.map((item) => ({
//                     productId: item.productId._id,
//                     brandName: item.productId.brandName,
//                     productName: item.productId.productName,
//                     category: item.productId.category,
//                     quantity: item.quantity,
//                     price: item.productId.price,
//                     availability: item.productId.availability,
//                     sellingPrice: item.productId.sellingPrice,
//                     productImage: item.productImage[0],
//                 })),
//                 email: user.email,
//                 userId: req.userId,
//                 totalAmount: totalAmount / 100,  // Convert to main currency unit (INR)
//                 paymentDetails: {
//                     paymentId: "",
//                     payment_method_type: "",
//                     payment_status: "pending",  // Payment status is initially pending
//                 },
//                 billing_name: customerInfo.firstName,
//                 billing_email: customerInfo.email,
//                 billing_tel: customerInfo.phone,
//                 billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
//                 shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
//                 statusUpdates: [{
//                     status: `pending-${req.userId}-${new Date().getTime()}`,  // Ensure unique status per user and time
//                     updatedAt: new Date()
//                 }],
//                 createdAt: new Date(),
//             });

//             // Send Razorpay order_id and other info to frontend
//             res.json({
//                 success: true,
//                 orderId: order.id,
//                 amount: totalAmount,
//                 currency: "INR",
//                 customerInfo,
//             });
//         }
//     } catch (error) {
//         console.error("Error initiating payment:", error);
//         res.status(500).json({
//             message: error.message || "Internal Server Error",
//             success: false,
//         });
//     }
// };






// exports.paymentController = async (req, res) => {
//     try {
//         const { cartItems, customerInfo, billingSameAsShipping } = req.body;

//         // Check if required data exists
//         if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
//             return res.status(400).json({ message: "Cart items are missing or invalid", success: false });
//         }

//         if (!customerInfo || typeof customerInfo !== 'object') {
//             return res.status(400).json({ message: "Invalid customer information", success: false });
//         }

//         if (billingSameAsShipping === undefined) {
//             return res.status(400).json({ message: "billingSameAsShipping is required", success: false });
//         }

//         // Log input data for debugging
//         console.log("Request Body:", req.body);

//         // Extract shipping and billing address
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

//         // Fetch the user from the database using the userId from the request
//         const user = await userModel.findById(req.userId);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found or invalid userId",
//                 success: false,
//             });
//         }

//         // Calculate total amount in currency's subunit (INR to paise)
//         const totalAmount = cartItems.reduce((total, item) => {
//             if (!item.productId || !item.quantity) {
//                 throw new Error("Product or quantity is missing");
//             }
//             return total + item.quantity * item.productId.sellingPrice;
//         }, 0) * 100;  // Razorpay uses smallest currency unit (paise)

//         console.log("Total Amount (in paise):", totalAmount); // Debugging the amount

//         // Check if the user has an existing order with pending status
//         const existingOrder = await orderModel.findOne({
//             userId: req.userId,
//             'paymentDetails.payment_status': 'pending',
//         });

//         let order, newOrder;

//         if (existingOrder) {
//             // If an order with pending status exists, update it with the selected cart items only
//             newOrder = existingOrder;
//             newOrder.productDetails = cartItems.map((item) => ({
//                 productId: item.productId._id,
//                 brandName: item.productId.brandName,
//                 productName: item.productId.productName,
//                 category: item.productId.category,
//                 quantity: item.quantity,
//                 price: item.productId.price,
//                 availability: item.productId.availability,
//                 sellingPrice: item.productId.sellingPrice,
//                 productImage: item.productId.productImage[0],
//             }));

//             newOrder.totalAmount = totalAmount / 100;  // Update with the new total amount
//             newOrder.statusUpdates.push({
//                 status: `pending-${req.userId}-${new Date().getTime()}`,
//                 updatedAt: new Date(),
//             });

//             await newOrder.save(); // Save updated order
//         } else {
//             // If no pending order exists, create a new Razorpay order
//             const options = {
//                 amount: totalAmount,
//                 currency: "INR",
//                 receipt: "order_rcptid_11",  // Static receipt ID for testing; make sure it's unique
//                 orderId:order.id,
//                 payment_capture: 1,  // Auto-captures payment
//             };

//             console.log("Creating Razorpay order with options:", options); // Debugging Razorpay order options

//             // Call Razorpay API to create an order
//             order = await razorpay.orders.create(options);

//             // Log Razorpay API response for debugging
//             console.log("Razorpay Order Response:", order);

//             if (!order || !order.id) {
//                 throw new Error("Failed to create Razorpay order.");
//             }

//             // Initialize statusUpdates with a valid status
//             const statusUpdates = [{
//                 status: "pending",  // Set initial status to 'pending'
//                 updatedAt: new Date()
//             }];

//             // Create a new order in the database
//             newOrder = await orderModel.create({
//                 orderId: order.id,
//                 productDetails: cartItems.map((item) => ({
//                     productId: item.productId._id,
//                     brandName: item.productId.brandName,
//                     productName: item.productId.productName,
//                     category: item.productId.category,
//                     quantity: item.quantity,
//                     price: item.productId.price,
//                     availability: item.productId.availability,
//                     sellingPrice: item.productId.sellingPrice,
//                     productImage: item.productId.productImage[0],
//                 })),
//                 email: user.email,
//                 userId: req.userId,
//                 totalAmount: totalAmount / 100,  // Convert to main currency unit (INR)
//                 paymentDetails: {
//                     paymentId: "",
//                     payment_method_type: "",
//                     payment_status: "pending",  // Payment status is initially pending
//                 },
//                 billing_name: customerInfo.firstName,
//                 billing_email: customerInfo.email,
//                 billing_tel: customerInfo.phone,
//                 billing_address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.state}, ${billingAddress.postalCode}, ${billingAddress.country}`,
//                 shipping_address: `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
//                 statusUpdates: [{
//                     status: `pending-${req.userId}-${new Date().getTime()}`,  // Ensure unique status per user and time
//                     updatedAt: new Date()
//                 }],
//                 createdAt: new Date(),
//             });
//         }

//         // Send Razorpay order_id and other info to frontend
//         res.json({
//             success: true,
//             orderId: newOrder.orderId || order.id,
//             amount: totalAmount,
//             currency: "INR",
//             customerInfo,
//         });
//     } catch (error) {
//         console.error("Error initiating payment:", error);
//         res.status(500).json({
//             message: error.message || "Internal Server Error",
//             success: false,
//         });
//     }
// };




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
// exports.verifyPayment = async (req, res) => {
//     const { razorpayPaymentId, cartItems, customerInfo, razorpayOrderId } = req.body;

//     if (!razorpayPaymentId || !razorpayOrderId) {
//         return res.status(400).json({
//             success: false,
//             message: 'Payment ID and Order ID are required'
//         });
//     }

//     try {
//         // Verify the payment status and get the payment method
//         const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);
//  console.log(paymentDetails);
 
//         if (isPaymentCaptured) {
//             // Batch database operations in parallel
//             const [updatedOrder, clearedCart] = await Promise.all([
//                 orderModel.findOneAndUpdate(
//                     { orderId: razorpayOrderId },
//                     {
//                         $set: {
//                             'paymentDetails.paymentId': razorpayPaymentId,
//                             'paymentDetails.payment_status': 'success',
//                             'paymentDetails.payment_method_type': paymentMethod, // Save payment method
//                             'paymentDetails.fullDetails': paymentDetails, // Save full payment details
//                             'order_status': 'ordered',
//                             updatedAt: new Date(),
//                         },
//                         $push: {
//                             statusUpdates: {
//                                 status: 'ordered',
//                                 timestamp: new Date(),
//                             },
//                         },
//                     },
//                     // { new: true }
//                 ),
//                 addToCartModel.deleteMany({ userId: req.userId }), // Clear cart in parallel
//             ]);
//             // Check if the order was updated
//             if (!updatedOrder) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Order not found.',
//                 });
//             }
//             // Calculate delivery date (4 days from now)
//             const deliveryDate = moment().add(4, 'days').toDate(); // Use moment.js to add 4 days

//             // Update the order with the delivery date
//             await orderModel.updateOne(
//                 { orderId: updatedOrder.orderId },
//                 { $set: { delivered_at: deliveryDate } }
//             );

//             // Parallelize product availability update and email sending
//             await Promise.all([
//                 // Update product availability in parallel
//                 ...cartItems.map((item) =>
//                     productModel.findByIdAndUpdate(
//                         item.productId._id,
//                         { $inc: { availability: -1 } }, // Decrease the available quantity by 1
//                         { new: true }
//                     )
//                 ),
//                 // Send emails in parallel
//                 sendOrderConfirmationEmail(customerInfo, razorpayPaymentId, updatedOrder),
//                 sendAdminNotificationEmail(updatedOrder),
//             ]);

//             res.json({
//                 success: true,
//                 message: 'Payment successful and order confirmed.',
//                 paymentMethod, // Optionally return the payment method in the response
//             });
//         } else {
//             // Payment failed, send cart reminder
//             await sendCartReminder(customerInfo, cartItems);

//             res.status(400).json({
//                 success: false,
//                 message: 'Payment failed. Reminder sent to complete the purchase.',
//             });
//         }
//     } catch (error) {
//         console.error("Error in verifyPayment:", error.message || error); // Log the specific error message
//         res.status(500).json({
//             success: false,
//             message: error.message || "Internal Server Error",
//         });
//     }
// };

// exports.verifyPayment = async (req, res) => {
//     const { razorpayPaymentId, cartItems, customerInfo, razorpayOrderId } = req.body;

//     if (!razorpayPaymentId || !razorpayOrderId) {
//         return res.status(400).json({
//             success: false,
//             message: 'Payment ID and Order ID are required'
//         });
//     }

//     try {
//         // Verify the payment status and get the payment method
//         const { isPaymentCaptured, paymentMethod, paymentDetails } = await verifyPayment(razorpayPaymentId);
//         console.log(paymentDetails);

//         if (isPaymentCaptured) {
//             // Batch database operations in parallel
//             const [updatedOrder, clearedCart] = await Promise.all([
//                 orderModel.findOneAndUpdate(
//                     { orderId: razorpayOrderId },
//                     {
//                         $set: {
//                             'paymentDetails.paymentId': razorpayPaymentId,
//                             'paymentDetails.payment_status': 'success',
//                             'paymentDetails.payment_method_type': paymentMethod, // Save payment method
//                             'paymentDetails.fullDetails': paymentDetails, // Save full payment details
//                             'order_status': 'ordered',
//                             updatedAt: new Date(),
//                         },
//                         $push: {
//                             statusUpdates: {
//                                 $each: [{
//                                     status: 'ordered',
//                                     timestamp: new Date(),
//                                 }],
//                                 $position: 0, // Optionally add at the beginning of the array
//                                 $slice: -1 // Optionally limit to 1 element in the statusUpdates array if required
//                             },
//                         },
//                     },
//                     { new: true }
//                 ),
//                 addToCartModel.deleteMany({ userId: req.userId }), // Clear cart in parallel
//             ]);

//             // Check if the order was updated
//             if (!updatedOrder) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Order not found.',
//                 });
//             }

//             // Calculate delivery date (4 days from now)
//             const deliveryDate = moment().add(4, 'days').toDate(); // Use moment.js to add 4 days

//             // Update the order with the delivery date
//             await orderModel.updateOne(
//                 { orderId: updatedOrder.orderId },
//                 { $set: { delivered_at: deliveryDate } }
//             );

//             // Parallelize product availability update and email sending
//             await Promise.all([
//                 // Update product availability in parallel
//                 ...cartItems.map((item) =>
//                     productModel.findByIdAndUpdate(
//                         item.productId._id,
//                         { $inc: { availability: -1 } }, // Decrease the available quantity by 1
//                         { new: true }
//                     )
//                 ),
//                 // Send emails in parallel
//                 sendOrderConfirmationEmail(customerInfo, razorpayPaymentId, updatedOrder),
//                 sendAdminNotificationEmail(updatedOrder),
//             ]);

//             res.json({
//                 success: true,
//                 message: 'Payment successful and order confirmed.',
//                 paymentMethod, // Optionally return the payment method in the response
//             });
//         } else {
//             // Payment failed, send cart reminder
//             await sendCartReminder(customerInfo, cartItems);

//             res.status(400).json({
//                 success: false,
//                 message: 'Payment failed. Reminder sent to complete the purchase.',
//             });
//         }
//     } catch (error) {
//         console.error("Error in verifyPayment:", error.message || error); // Log the specific error message
//         res.status(500).json({
//             success: false,
//             message: error.message || "Internal Server Error",
//         });
//     }
// };
// const moment = require('moment');
// const { sendOrderConfirmationEmail, sendAdminNotificationEmail, sendCartReminder } = require('./emailService'); // Adjust imports as necessary

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

            const productUpdatePromises = cartItems.map((item) =>
                productModel.findByIdAndUpdate(
                    item.productId._id,
                    { $inc: { availability: -1 } },
                    { new: true }
                )
            );

            // Handle potential errors in parallel promises
            try {
                await Promise.all([...emailPromises, ...productUpdatePromises]);
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
// const sendEmail = async (order, subject, message) => {
//     console.log('Order:', order);
// console.log('Recipient Email:', order.billing_email);

//     // if (!order || !order.billing_email) {
//     //   console.error('Error: No recipient email provided');
//     //   return; // Exit early if order or billing_email is missing
//     // }
    
//     try {
//       await transporter.sendMail({
//         from: 'support@reldaindia.com', // Sender's email
//         to: order.billing_email, // Receiver's email
//         subject: subject,
//         text: message,
//       });
//       console.log('Email sent successfully');
//     } catch (error) {
//       console.error('Error sending email:', error);
//     } 
//   };
  
//   exports.updateOrderStatus = async (req, res) => {
//     const { orderId, order_status } = req.body;

//     try {
//         // Validate the new status
//         const validStatuses = ['ordered', 'packaged', 'shipped', 'delivered', 'failed', 'returnAccepted', 'returned'];
//         if (!validStatuses.includes(order_status)) {
//             return res.status(400).json({ status: 'failed', message: 'Invalid status provided.' });
//         }
//         // const validTransitions = {
//         //     ordered: ['packaged'],           
//         //     packaged: ['shipped'],
//         //     shipped: ['delivered', 'returnAccepted'],
//         //     delivered: [], // No further transitions
//         //     returnAccepted: ['returned'],
//         //     returned: [], // No further transitions
//         //     failed: [], // No further transitions
//         // };
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
        
        
//         // Find the order by ID
//         const order = await orderModel.findOne({ orderId: orderId });
//         if (!order) {
//             return res.status(404).json({ status: 'failed', message: 'Order not found.' });
//         }

//          // Check if the new status is valid
//          const currentStatus = order.order_status;
//          const allowedStatuses = validTransitions[currentStatus] || [];
//          if (!allowedStatuses.includes(order_status)) {
//              return res.status(400).json({
//                  status: 'failed',
//                  message: `Cannot change status from '${currentStatus}' to '${order_status}'.`,
//              });
//          }
      
//         // Update order status and timestamp
//         order.order_status = order_status;
//         order.statusUpdatedAt = Date.now();  // Save the current timestamp

//         // Push the new status update to the statusUpdates array
//         order.statusUpdates.push({
//             status: order_status,
//             timestamp: order.statusUpdatedAt
//         });

//         await order.save();

//         // Format the timestamp into 12-hour format
//         const formattedTimestamp = moment(order.statusUpdatedAt).format('hh:mm A'); // 12-hour format (e.g., 2:30 PM)


//         // Send follow-up email based on the status update
//         let emailMessage = '';
//         let emailSubject = `Your Order #${orderId} Status Update`;

//         // Define the email content based on status change
//         if (order_status === 'packaged') {
//             emailMessage = `Dear #${order.billing_name},\n\nYour order #${orderId} has been packed and is ready for shipping! ?? You ll receive an update once it is shipped.`;
//         } else if (order_status === 'shipped') {
//             emailMessage = `Dear #${order.billing_name},\n\nYour order #${orderId} has been shipped and should arrive soon.`;
//         } else if (order_status === 'delivered') {
//             emailMessage = `Dear #${order.billing_name},\n\nWe re happy to confirm that your order #${orderId} has been delivered! ?? We hope everything is perfect. Thank you for being a valued customer! If you have any queries, feel free to contact us.`;
//         }else if (order_status === 'returnAccepted') {
//             emailMessage = `Dear #${order.billing_name},\n\nWe regret to inform you that your order #${orderId} has been return request accepted. If you have any questions, please don't hesitate to reach out.`;
//         }else if (order_status === 'returned') {
//             emailMessage = `Dear #${order.billing_name},\n\nWe regret to inform you that your order #${orderId} has been product returned . If you have any questions, please don't hesitate to reach out.`;
//          }

//         // Ensure email is defined before sending
//         if (order.billing_email) {
//             await sendEmail(order.billing_email, emailSubject, emailMessage); // Send the email
//         } else {
//             console.error(`No customer email for order #${orderId}`);
//         }

//         return res.status(200).json({
//             status: 'success',
//             message: `Order ${orderId} updated to '${order_status}'.`,
//             timestamp: formattedTimestamp, // Include the formatted timestamp in the response
//             statusUpdates: order.statusUpdates, // Return all status updates with timestamps
//         });
//     } catch (error) {
//         console.error('Error in updating order status:', error);
//         return res.status(500).json({ status: 'failed', message: 'Internal server error' });
//     }
// };

// exports.updateOrderStatus = async (req, res) => {
//     const { orderId, order_status } = req.body;

//     try {
//         // Validate the new status
//         const validStatuses = ['pending','ordered', 'packaged', 'shipped', 'delivered', 'failed', 'returnAccepted', 'returned'];
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
//         order.statusUpdatedAt = Date.now();

//         // Push the new status update to the statusUpdates array
//         order.statusUpdates.push({
//             status: order_status,
//             timestamp: order.statusUpdatedAt,
//         });

//         await order.save();

//         // Format the timestamp into 12-hour format
//         const formattedTimestamp = moment(order.statusUpdatedAt).format('hh:mm A');

//         // Prepare email content
//         let emailMessage = '';
//         // const emailSubject =' `Your Order #${orderId} Status Update`';
//         const emailSubject ='';


//         switch (order_status) {
//             case 'packaged':
//                 emailSubject = `Your Order is Packed and Ready for Shipping`
//                emailMessage = `
//     Dear ${order.billing_name},

//     We're excited to let you know that your order is packed and ready for shipping!

//     <strong>Here are your order details:</strong>
//     <ul>
//         <li><strong>Product Name:</strong> ${product.productName}</li>
//         <li><strong>Order Number:</strong> ${order.orderId}</li>
//         <li><strong>Estimated Delivery:</strong> ${order.estimatedDeliveryDate}</li>
//     </ul>

//     If you have any questions, feel free to contact us at [support@reldaindia.com/9884890934]. We're always happy to help!

//     Thank you for shopping with Elda Appliances.

//     Best Regards,<br>
//     The Elda Appliances Team
// `;

//                 break;
//             case 'shipped':
//                 emailSubject = `Your Product Has Been Shipped`
//                 emailMessage = `Dear ${order.billing_name},

//     Great news! Your product has been shipped and is on its way to you.

//     <strong>Here are the shipping details:</strong>
//     <ul>
//         <li><strong>Product Name:</strong> ${product.productName}</li>
//         <li><strong>Order Number:</strong> ${order.orderId}</li>
//         <li><strong>Estimated Delivery:</strong> Within 24 Hrs</li>
//     </ul>

//     If you have any questions, feel free to reach out to us at [support@reldaindia.com/9884890934]. We're always happy to help!

//     Best Regards,<br>
//     The Elda Appliances Team
// `;

//                 break;
//             case 'delivered':
//                 emailSubject = `Thank You for Your Order!`
//                 emailMessage = `
//                 Dear ${order.billing_name},
            
//                 We're happy to let you know that your ${product.productName} has been successfully delivered! We hope it brings you joy and meets your expectations.
            
//                 <strong>Order Details:</strong>
//                 <ul>
//                     <li><strong>Product:</strong> ${product.productName}</li>
//                     <li><strong>Delivery Date:</strong> ${new Date().toLocaleDateString()}</li>
//                 </ul>
            
//                 If you have any questions or need help with your purchase, our customer service team is here for you. Feel free to contact us at [support@eldappliances.com/9884890934]. We're always happy to help!
            
//                 Thank you for choosing Elda Appliances. We look forward to serving you again!
            
//                 Best Regards,<br>
//                 The Elda Appliances Team
//             `;
//                 break;
//             case 'returnAccepted':
//                 emailMessage = `Dear ${order.billing_name},\n\nYour return request for order #${orderId} has been accepted.`;
//                 break;
//             case 'returned':
//                 emailMessage = `Dear ${order.billing_name},\n\nYour order #${orderId} has been returned.`;
//                 break;
//         }

//         // Send email if email exists
//         if (order.billing_email) {
//             await sendEmail(order.billing_email, emailSubject, emailMessage);
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

exports.updateOrderStatus = async (req, res) => {
    const { orderId, order_status } = req.body;

    try {
        // Validate the new status
        const validStatuses = ['pending', 'ordered', 'packaged', 'shipped', 'delivered', 'failed', 'returnAccepted', 'returned'];
        const validTransitions = {
            ordered: ['packaged'],
            packaged: ['shipped'],
            shipped: ['delivered', 'returnRequested'],
            returnRequested: ['returnAccepted'], // Add this transition
            returnAccepted: ['returned'],
            returned: [], // No further transitions
            delivered: [], // No further transitions
            failed: [], // No further transitions
        };

        if (!validStatuses.includes(order_status)) {
            return res.status(400).json({ status: 'failed', message: 'Invalid status provided.' });
        }

        // Find the order by ID
        const order = await orderModel.findOne({ orderId });
        if (!order) {
            return res.status(404).json({ status: 'failed', message: 'Order not found.' });
        }

        const currentStatus = order.order_status;
        const allowedStatuses = validTransitions[currentStatus] || [];
        if (!allowedStatuses.includes(order_status)) {
            return res.status(400).json({
                status: 'failed',
                message: `Cannot change status from '${currentStatus}' to '${order_status}'.`,
            });
        }

        // Update order status and timestamp
        order.order_status = order_status;
        const statusUpdatedAt = Date.now();
        order.statusUpdatedAt = statusUpdatedAt;

        // Push the new status update to the statusUpdates array with timestamp
        order.statusUpdates.push({
            status: order_status,
            updatedAt: statusUpdatedAt,
        });

        await order.save();

        // Format the timestamp into 12-hour format
        const formattedTimestamp = moment(statusUpdatedAt).format('hh:mm A');

        // Prepare email content for each case
        let emailMessage = '';
        let emailSubject = ''; // Change const to let so that it can be reassigned

        switch (order_status) {
            case 'packaged':
                emailSubject = 'Your Order is Packed and Ready for Shipping';
                emailMessage = `
                    <p>Dear <strong>${order.billing_name}</strong>,</p>
                    <p>We're excited to let you know that your order is packed and ready for shipping!</p>
                    <p>Here are your order details:</p>
                    <ul>
                        <li><strong>Product Name</strong>: ${order.productDetails[0].productName}</li>
                        <li><strong>Order Number</strong>: ${order.orderId}</li>
                        <li><strong>Estimated Delivery</strong>: ${order.estimatedDeliveryDate || 'Within 4-5 days'}</li>
                    </ul>
                    <p>If you have any questions, feel free to contact us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>. We're always happy to help!</p>
                    <p>Thank you for shopping with Elda Appliances.</p>
                    <p>Best Regards, <br>The Elda Appliances Team</p>
                `;
                break;

            case 'shipped':
                emailSubject = 'Your Product Has Been Shipped';
                emailMessage = `
                    <p>Dear <strong>${order.billing_name}</strong>,</p>
                    <p>Great news! Your product has been shipped and is on its way to you.</p>
                    <p>Here are the shipping details:</p>
                    <ul>
                        <li><strong>Product Name</strong>: ${order.productDetails[0].productName}</li>
                        <li><strong>Order Number</strong>: ${order.orderId}</li>
                        <li><strong>Estimated Delivery</strong>: Within 4-5 days</li>
                    </ul>
                    <p>If you have any questions, feel free to reach out to us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>. We're always happy to help!</p>
                    <p>Best Regards, <br>The Elda Appliances Team</p>
                `;
                break;

            case 'delivered':
                emailSubject = 'Thank You for Your Order!';
                emailMessage = `
                    <p>Dear <strong>${order.billing_name}</strong>,</p>
                    <p>We're happy to let you know that your ${order.productDetails[0].productName} has been successfully delivered! We hope it brings you joy and meets your expectations.</p>
                    <p>Order Details:</p>
                    <ul>
                        <li><strong>Product</strong>: ${order.productDetails[0].productName}</li>
                        <li><strong>Delivery Date</strong>: ${new Date().toLocaleDateString()}</li>
                    </ul>
                    <p>If you have any questions or need help with your purchase, our customer service team is here for you. Feel free to contact us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>. We're always happy to help!</p>
                    <p>Thank you for choosing Elda Appliances. We look forward to serving you again!</p>
                    <p>Best Regards, <br>The Elda Appliances Team</p>
                `;
                break;

            case 'returnAccepted':
                emailSubject = 'Your Return Request Has Been Accepted';
                emailMessage = `
                    <p>Dear <strong>${order.billing_name}</strong>,</p>
                    <p>Your return request for order #${order.orderId} has been accepted. We are processing the return and will update you shortly.</p>
                    <p>If you have any questions or need further assistance, feel free to contact us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>.</p>
                    <p>Best Regards, <br>The Elda Appliances Team</p>
                `;
                break;

            case 'returned':
                emailSubject = 'Your Order Has Been Returned';
                emailMessage = `
                    <p>Dear <strong>${order.billing_name}</strong>,</p>
                    <p>Your order #${order.orderId} has been successfully returned. Thank you for your cooperation.</p>
                    <p>If you have any further questions, feel free to reach out to us at <strong>support@reldaindia.com</strong> or call us at <strong>9884890934</strong>.</p>
                    <p>Best Regards, <br>The Elda Appliances Team</p>
                `;
                break;
        }

        console.log(`Sending email to: ${order.billing_email}`);

        // Send email if email exists
        if (order.billing_email) {
            await sendEmail(order.billing_email, emailSubject, emailMessage, 'html'); // 'text' indicates plain text email
        } else {
            console.error(`No email found for order #${orderId}`);
        }

        return res.status(200).json({
            status: 'success',
            message: `Order #${orderId} updated to '${order_status}'.`,
            timestamp: formattedTimestamp,
            statusUpdates: order.statusUpdates,
        });

    } catch (error) {
        console.error('Error in updating order status:', error);
        return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
};



exports.CancelOrder = async (req, res) => {
    const { orderId, cancelReason, customComment, order_status } = req.body;

    // Check if all necessary data is provided
    if (!orderId || !cancelReason || !order_status) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Find the order
        const order = await orderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order is already cancelled
        if (order.order_status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }


        // Update order status and reason
        order.order_status = 'cancelled';
        order.cancellationReason = cancelReason; // Store the cancellation reason
        order.customComment = customComment || ''; // Store custom comment if provided
        order.statusUpdates.push({
            status: 'cancelled',
            timestamp: new Date(), // Set timestamp for the cancellation status update
        });

        // Check if the order contains items
        const cartItems = order.productDetails || []; // Use the correct field for items

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ message: 'No items found in the order to cancel.' });
        }

        // Increase product availability
        await Promise.all(
            cartItems.map(async (item) => {
                await productModel.findByIdAndUpdate(
                    item.productId, // Adjust field based on schema
                    { $inc: { availability: item.quantity } },
                    { new: true }
                );
            })
        );

        // Save the updated order
        await order.save();

        // Send email notification
        await sendCancellationEmail(order, cancelReason, customComment);

        return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (err) {
        console.error('Error canceling order:', err);
        return res.status(500).json({ message: 'An error occurred while canceling the order' });
    }
};
  // Function to send email notification
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


 