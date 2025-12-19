const cron = require('node-cron');
const Order = require('./models/Order'); // Assuming the order schema is in this file
const axios = require('axios'); // For making API calls

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running the shipping status cron job...');

  try {
    // Find orders with tracking IDs that are not yet delivered
    const orders = await Order.find({ trackingId: { $ne: null }, shippingStatus: { $ne: "Delivered" } });

    for (const order of orders) {
      // Replace with your shipping provider's API endpoint and API key
      const response = await axios.get(`https://shippingapi.com/track/${order.paymentDetails.trackingId}`, {
        headers: { 'Authorization': 'Bearer YOUR_SHIPPING_API_KEY' }
      });

      const { status } = response.data; // Assuming status is in response

      // Update shipping status in the database
      order.shippingStatus = status;
      await order.save();

      // If the order is delivered, send a satisfaction survey prompt to the customer
      if (status === "Delivered") {
        sendCustomerSatisfactionPrompt(order);
      }
    }

    console.log('Shipping status update completed.');
  } catch (error) {
    console.error('Error updating shipping status:', error);
  }
});
