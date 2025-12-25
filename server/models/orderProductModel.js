// const mongoose = require('mongoose');

// // Schema
// const orderSchema = new mongoose.Schema({
//     orderId: { type: String, required: true, unique: true },
//     productDetails: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//             productName: String,
//             category: String,
//             quantity: Number,
//             price: Number,
//             sellingPrice : Number,
//             availability: { type: Number },
//             productImage: String,
//             brandName: String,
//             isReturn: { type: Boolean, default: false },
//         }
//     ],
//     email: String,
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     totalAmount: Number,
//     paymentDetails: {
//         trackingId: String,
//         payment_method_type: String,
//         // payment_method: String, // Add this field to store the actual payment method (card, upi, etc.)
//         payment_status: String,
//     },
//     billing_name: { type: String },
//     billing_email: { type: String },
//     billing_tel: { type: String },
//     billing_address: Object,
//     shipping_address: Object,
//     shippingOption: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
//     order_status: { type: String, default: 'Pending' },
//     statusUpdatedAt: { type: Date, default: Date.now },
//     // statusUpdates: [
//         // {
//         //     status: { type: String },
//         //     timestamp: { type: Date, default: Date.now }
//         // }
//         statusUpdates: [{
//             status: { type: String },  // Remove the unique index here
//             updatedAt: Date
//         }],
//     // ],
    
//     cancellationReason: { type: String, default: '' },
//     createdAt: { type: Date, default: Date.now },
//     reminderSent: { type: Boolean, default: false },
//     delivered_at: Date,
//     returnProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
//     returnReason: { type: String, default: '' }, // Reason for returning the order
//     returnImages: [
//         {
//           data: Buffer, 
//           contentType: String, 
//         },
//       ],
//     customComment: { type: String, default: '' }, // Optional custom comment for return
// });

// // Model
// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;
const mongoose = require('mongoose');

// Schema
const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    productDetails: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            productName: String,
            category: String,
            quantity: Number,
            price: Number,
            sellingPrice: Number,
            availability: { type: Number },
            productImage: String,
            brandName: String,
            isReturn: { type: Boolean, default: false },
        }
    ],
    email: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalAmount: Number,
    paymentDetails: {
        trackingId: String,
        payment_method_type: String,
        payment_status: String,
    },
    // coupon: Object,
    coupon: {
  code: String,
  discountType: String,
  discountValue: Number,
  discountAmount: Number,
  minOrderAmount: Number
},
    subTotal: Number,
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },

    billing_name: { type: String },
    billing_email: { type: String },
    billing_tel: { type: String },
    billing_address: Object,
    shipping_address: Object,
    shippingOption: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
    order_status: { type: String, default: 'Pending' },
    statusUpdatedAt: { type: Date, default: Date.now },
    statusUpdates: [{
        status: { type: String },  // Removed the unique index here
        updatedAt: { type: Date, default: Date.now }
    }],
    cancellationReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    reminderSent: { type: Boolean, default: false },
    delivered_at: Date,
    returnProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    returnReason: { type: String, default: '' },
    returnImages: [
        {
            data: Buffer, 
            contentType: String, 
        },
    ],
    customComment: { type: String, default: '' },
});

// Model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
