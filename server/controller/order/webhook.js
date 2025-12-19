// const crypto = require('crypto');
// const orderModel = require('../../models/orderProductModel'); // Ensure this path is correct for your project

// const webhook = async (req, res) => {
//     try {
//         const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//         const body = JSON.stringify(req.body);
//         const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

//         if (signature === req.headers['x-razorpay-signature']) {
//             const { payload } = req.body;
//             console.log('Received Webhook Payload:', req.body);

//             if (payload.payment && payload.payment.entity.status === 'captured') {
//                 const paymentDetails = payload.payment.entity;
//                 console.log('Payment Details:', paymentDetails);

//                 // Acknowledge the webhook immediately
//                 res.status(200).json({ success: true, message: 'Payment verified via webhook.' });

//                 try {
//                     const { order_id, payment_id, amount, status } = paymentDetails;

//                     console.log(`Processing payment for Order ID: ${order_id}, Payment ID: ${payment_id}, Status: ${status}`);

//                     // Ensure the status is valid before proceeding
//                     if (!status || status === 'null') {
//                         console.error('Invalid payment status:', status);
//                         return;
//                     }

//                     // Find the existing order
//                     const existingOrder = await orderModel.findOne({ orderId: order_id });

//                     if (!existingOrder) {
//                         console.error(`Order with ID ${order_id} not found.`);
//                         return;
//                     }

//                     // Check if the status already exists in the statusUpdates array
//                     const existingStatus = existingOrder.statusUpdates.find(update => update.status === 'payment_verified');

//                     if (existingStatus) {
//                         console.log('Payment verification status already added.');
//                         return;
//                     }

//                     // Update the order in your database with the payment details
//                     const updatedOrder = await orderModel.findOneAndUpdate(
//                         { orderId: order_id },
//                         {
//                             $set: {
//                                 'paymentDetails.paymentId': payment_id,
//                                 'paymentDetails.payment_status': status,
//                                 'paymentDetails.amount': amount / 100,  // Razorpay returns amount in paise, so divide by 100 for INR
//                             },
//                             $addToSet: {
//                                 statusUpdates: {
//                                     status: 'payment_verified',
//                                     timestamp: new Date(),
//                                 },
//                             },
//                         },
//                         { new: true }
//                     );

//                     if (!updatedOrder) {
//                         console.error(`Order with ID ${order_id} not found or update failed.`);
//                         return;
//                     }

//                     console.log(`Order ${order_id} updated successfully with payment details.`);
//                 } catch (error) {
//                     console.error(`Error processing payment for Order ID: ${paymentDetails.order_id}. Error: ${error.message}`);
//                 }
//             } else {
//                 console.warn('Unsupported event type or payment not captured:', payload);
//                 res.status(400).json({ success: false, message: 'Unsupported event type or payment not captured.' });
//             }
//         } else {
//             console.error('Invalid signature:', req.headers['x-razorpay-signature']);
//             res.status(400).json({ success: false, message: 'Invalid signature.' });
//         }
//     } catch (error) {
//         console.error('Webhook Error:', error.message || error);
//         res.status(500).json({ success: false, message: 'Webhook handling error.' });
//     }
// };

// module.exports = webhook;


// const crypto = require('crypto');
// const orderModel = require('../../models/orderProductModel');
// const addToCartModel = require('../../models/cartProduct');

// const webhook = async (request, response) => {
//     const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     const shasum = crypto.createHmac('sha256', secret);
//     shasum.update(JSON.stringify(request.body));
//     const digest = shasum.digest('hex');

//     if (digest === request.headers['x-razorpay-signature']) {
//         const event = request.body;

//         if (event.event === 'payment.captured') {
//             const { order_id, payment_id } = event.payload.payment.entity;
//             const order = await orderModel.findOne({ razorpayOrderId: order_id });

//             order.paymentDetails.paymentId = payment_id;
//             order.paymentDetails.payment_status = 'captured';
//             order.paymentDetails.payment_method_type = 'razorpay';

//             await order.save();

//             // Delete Cart Items
//             await addToCartModel.deleteMany({ userId: order.userId });

           
//         }

//         response.status(200).json({ status: 'ok' });
//     } else {
//         response.status(400).json({ message: 'Invalid signature' });
//     }
// };

// module.exports = webhook;


const crypto = require('crypto');
const orderModel = require('../../models/orderProductModel');
const addToCartModel = require('../../models/cartProduct');

const webhook = async (request, response) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Create the HMAC hash to verify the signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(request.body));
    const digest = shasum.digest('hex');

    // Verify the webhook signature
    if (digest === request.headers['x-razorpay-signature']) {
        const event = request.body;

        // Process the 'payment.captured' event
        if (event.event === 'payment.captured') {
            try {
                const { order_id, payment_id } = event.payload.payment.entity;

                // Find the corresponding order by Razorpay Order ID
                const order = await orderModel.findOne({ razorpayOrderId: order_id });

                if (!order) {
                    console.error(`Order not found for orderId: ${order_id}`);
                    return response.status(404).json({ message: 'Order not found' });
                }

                // Update the order payment details
                order.paymentDetails.paymentId = payment_id;
                order.paymentDetails.payment_status = 'captured';
                order.paymentDetails.payment_method_type = 'razorpay';

                await order.save();

                // Delete Cart Items associated with the user
                await addToCartModel.deleteMany({ userId: order.userId });

                console.log(`Payment captured successfully for Order ID: ${order_id}`);

                // Respond to Razorpay Webhook
                return response.status(200).json({ status: 'ok' });
            } catch (error) {
                console.error('Error processing payment captured event:', error);
                return response.status(500).json({ message: 'Internal server error' });
            }
        } else {
            console.log('Event type is not payment.captured, event ignored.');
            return response.status(200).json({ status: 'ok' });
        }
    } else {
        console.error('Invalid signature');
        return response.status(400).json({ message: 'Invalid signature' });
    }
};

module.exports = webhook;
