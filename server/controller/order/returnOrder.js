const Order = require('../../models/orderProductModel');
const transporter = require('../../config/nodemailerConfig');
const upload = require('../../config/multerConfig'); // Import multer config

exports.returnOrder = async (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: err.message });
      }

      try {
          const { orderId, returnReason, productIds, order_status } = req.body;
          const returnImages = req.files; // Array of uploaded files

          // Validate inputs
          if (!orderId || !returnReason || !order_status || !productIds || returnImages.length === 0) {
              return res.status(400).json({
                  message: 'Order ID, return reason, at least one product ID, and return images are required.',
              });
          }

          // Find the order by orderId
          const order = await Order.findOne({ orderId });
          if (!order) {
              return res.status(404).json({ success: false, message: 'Order not found.' });
          }

          // Check if the order is already returnRequested
          if (order.order_status === 'returnRequested') {
              return res.status(400).json({ message: 'Order is already returnRequested.' });
          }

          // Update `isReturn` field in productDetails for the specified product IDs
          order.productDetails.forEach((product) => {
              if (productIds.includes(product.productId.toString())) {
                  product.isReturn = true; // Set isReturn to true for the returned product
              }
          });

          // Convert uploaded files to binary data and add to order
          const binaryImages = returnImages.map((file) => ({
              data: file.buffer, // Binary data from multer
              contentType: file.mimetype, // MIME type
          }));

          // Update order details
          order.order_status = 'returnRequested';
          order.returnReason = returnReason;
          order.returnProducts = productIds; // Add the product IDs to the returnProducts array
          order.returnImages = binaryImages; // Store binary images
          order.statusUpdates.push({
              status: 'returnRequested',
              timestamp: new Date(),
          });

          // Save the updated order
          await order.save();

          // Send return product email (you can modify this function to include binary data if needed)
          await sendReturnProductEmail(order, returnReason, binaryImages);

          return res.status(200).json({ message: 'Order returnRequested successfully.' });
      } catch (error) {
          console.error('Error returning order:', error);
          return res.status(500).json({ message: 'An error occurred while returning the order.' });
      }
  });
};
  
  
  exports.returnOrder = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
  
        try {
            const { orderId, returnReason, productIds, order_status } = req.body;
            const returnImages = req.files; // Array of uploaded files
  
            // Validate inputs
            if (!orderId || !returnReason || !order_status || !productIds || returnImages.length === 0) {
                return res.status(400).json({
                    message: 'Order ID, return reason, at least one product ID, and return images are required.',
                });
            }
  
            // Find the order by orderId
            const order = await Order.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }
  
            // Check if the order is already returnRequested
            if (order.order_status === 'returnRequested') {
                return res.status(400).json({ message: 'Order is already returnRequested.' });
            }
  
            // Update `isReturn` field in productDetails for the specified product IDs
            order.productDetails.forEach((product) => {
                if (productIds.includes(product.productId.toString())) {
                    product.isReturn = true; // Set isReturn to true for the returned product
                }
            });
  
            // Convert uploaded files to binary data and add to order
            const binaryImages = returnImages.map((file) => ({
                data: file.buffer, // Binary data from multer
                contentType: file.mimetype, // MIME type
            }));
  
            // Update order details
            order.order_status = 'returnRequested';
            order.returnReason = returnReason;
            order.returnProducts = productIds; // Add the product IDs to the returnProducts array
            order.returnImages = binaryImages; // Store binary images
            order.statusUpdates.push({
                status: 'returnRequested',
                timestamp: new Date(),
            });
  
            // Save the updated order
            await order.save();
  
            // Send return product email (you can modify this function to include binary data if needed)
            await sendReturnProductEmail(order, returnReason, binaryImages);
  
            return res.status(200).json({ message: 'Order returnRequested successfully.' });
        } catch (error) {
            console.error('Error returning order:', error);
            return res.status(500).json({ message: 'An error occurred while returning the order.' });
        }
    });
  };
  

// Function to send email notification
async function sendReturnProductEmail(order, returnReason, returnImages) {
    // Create the email content
    const adminEmailContent = `
      Order Return Notification:
  
      Order ID: ${order.orderId}
      Customer Name: ${order.billing_name}
      Customer Email: ${order.billing_email}
  
      Return Reason: ${returnReason}
  
      Please review the order return and take any necessary actions.
  
      Best regards,
      Elda Appliances
    `;
  
    // Prepare attachments if images are provided
    const attachments = returnImages.map((image, index) => ({
      filename: `return_image_${index + 1}.png`, // Set a filename for each image
      content: image.data, // Binary data
      contentType: image.contentType, // MIME type
    }));
  
    // Configure email options
    const adminMailOptions = {
      from: 'support@eldaappliances.com',
      to: 'admin@eldaappliances.com', // Admin email
      subject: 'Order Return Notification',
      text: adminEmailContent,
      attachments, // Add attachments
    };
  
    // Send the email
    try {
      await transporter.sendMail(adminMailOptions);
      console.log('Return product email with attachments sent to admin');
    } catch (error) {
      console.error('Error sending return email with attachments:', error);
    }
  }
  
  exports.getReturnImages = async (req, res) => {
    try {
      // Fetch the order document by ID
      const order = await Order.findById(req.params.id);
  
      // Validate if the order exists
      if (!order || !order.returnImages || order.returnImages.length === 0) {
        return res.status(404).json({ message: 'No return images found for this order.' });
      }
  
      // Map images to include both content type and binary data
      const images = order.returnImages.map((image, index) => ({
        index, // To indicate the image index
        contentType: image.contentType,
        data: image.data.toString('base64'), // Convert binary data to base64 for easier transmission
      }));
  
      // Send all images as JSON
      res.status(200).json({
        message: 'Return images fetched successfully.',
        images,
      });
    } catch (error) {
      console.error('Error fetching return images:', error);
      res.status(500).json({ message: 'Internal Server Error.' });
    }
  };
  

  // exports.getReturnImages = async (req, res) => {
  //   try {
  //     // Fetch the order document by ID
  //     const order = await Order.findById(req.params.id);
  
  //     // Validate if the order exists
  //     if (!order || !order.returnImages || order.returnImages.length === 0) {
  //       return res.status(404).json({ message: 'No return images found for this order' });
  //     }
  
  //     // Get the image index from the query parameter or default to the first image
  //     const imageIndex = req.query.index ? parseInt(req.query.index, 10) : 0;
  
  //     // Validate the index
  //     if (imageIndex < 0 || imageIndex >= order.returnImages.length) {
  //       return res.status(400).json({ message: 'Invalid image index' });
  //     }
  
  //     const image = order.returnImages[imageIndex];
  
  //     // Send the image with the correct content type
  //     res.set('Content-Type', image.contentType);
  //     res.send(image.data);
  //   } catch (error) {
  //     console.error('Error fetching return images:', error);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // };
  

  // const fetchReturnImages = async (orderId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/return-order-images/${orderId}`);
  //     if (!response.ok) {
  //       console.error('Failed to fetch return images');
  //       return;
  //     }
  
  //     const result = await response.json();
  //     console.log(result.images); // Array of images with base64 data
  //   } catch (error) {
  //     console.error('Error fetching return images:', error);
  //   }
  // };
  
  // // Call the function with an order ID
  // fetchReturnImages('675190a522e675bb5130f13e');
  