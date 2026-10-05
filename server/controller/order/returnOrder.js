// const Order = require('../../models/orderProductModel');
// const transporter = require('../../config/nodemailerConfig');
// const upload = require('../../config/multerConfig'); // Import multer config

// // exports.returnOrder = async (req, res) => {
// //   upload(req, res, async (err) => {
// //       if (err) {
// //           return res.status(400).json({ message: err.message });
// //       }

// //       try {
// //           const { orderId, returnReason, productIds, order_status } = req.body;
// //           const returnImages = req.files; // Array of uploaded files

// //           // Validate inputs
// //           if (!orderId || !returnReason || !order_status || !productIds || returnImages.length === 0) {
// //               return res.status(400).json({
// //                   message: 'Order ID, return reason, at least one product ID, and return images are required.',
// //               });
// //           }

// //           // Find the order by orderId
// //           const order = await Order.findOne({ orderId });
// //           if (!order) {
// //               return res.status(404).json({ success: false, message: 'Order not found.' });
// //           }

// //           // Check if the order is already returnRequested
// //           if (order.order_status === 'returnRequested') {
// //               return res.status(400).json({ message: 'Order is already returnRequested.' });
// //           }

// //           // Update `isReturn` field in productDetails for the specified product IDs
// //           order.productDetails.forEach((product) => {
// //               if (productIds.includes(product.productId.toString())) {
// //                   product.isReturn = true; // Set isReturn to true for the returned product
// //               }
// //           });

// //           // Convert uploaded files to binary data and add to order
// //           const binaryImages = returnImages.map((file) => ({
// //               data: file.buffer, // Binary data from multer
// //               contentType: file.mimetype, // MIME type
// //           }));

// //           // Update order details
// //           order.order_status = 'returnRequested';
// //           order.returnReason = returnReason;
// //           order.returnProducts = productIds; // Add the product IDs to the returnProducts array
// //           order.returnImages = binaryImages; // Store binary images
// //           order.statusUpdates.push({
// //               status: 'returnRequested',
// //               timestamp: new Date(),
// //           });

// //           // Save the updated order
// //           await order.save();

// //           // Send return product email (you can modify this function to include binary data if needed)
// //           await sendReturnProductEmail(order, returnReason, binaryImages);

// //           return res.status(200).json({ message: 'Order returnRequested successfully.' });
// //       } catch (error) {
// //           console.error('Error returning order:', error);
// //           return res.status(500).json({ message: 'An error occurred while returning the order.' });
// //       }
// //   });
// // };
  
  
//   exports.returnOrder = async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: err.message });
//         }
  
//         try {
//             const { orderId, returnReason, productIds, order_status } = req.body;
//             const returnImages = req.files; // Array of uploaded files
  
//             // Validate inputs
//             if (!orderId || !returnReason || !order_status || !productIds || returnImages.length === 0) {
//                 return res.status(400).json({
//                     message: 'Order ID, return reason, at least one product ID, and return images are required.',
//                 });
//             }
  
//             // Find the order by orderId
//             const order = await Order.findOne({ orderId });
//             if (!order) {
//                 return res.status(404).json({ success: false, message: 'Order not found.' });
//             }
  
//             // Check if the order is already returnRequested
//             if (order.order_status === 'returnRequested') {
//                 return res.status(400).json({ message: 'Order is already returnRequested.' });
//             }
  
//             // Update `isReturn` field in productDetails for the specified product IDs
//             order.productDetails.forEach((product) => {
//                 if (productIds.includes(product.productId.toString())) {
//                     product.isReturn = true; // Set isReturn to true for the returned product
//                 }
//             });
  
//             // Convert uploaded files to binary data and add to order
//             const binaryImages = returnImages.map((file) => ({
//                 data: file.buffer, // Binary data from multer
//                 contentType: file.mimetype, // MIME type
//             }));
  
//             // Update order details
//             order.order_status = 'returnRequested';
//             order.returnReason = returnReason;
//             order.returnProducts = productIds; // Add the product IDs to the returnProducts array
//             order.returnImages = binaryImages; // Store binary images
//             order.statusUpdates.push({
//                 status: 'returnRequested',
//                 timestamp: new Date(),
//             });
  
//             // Save the updated order
//             await order.save();
  
//             // Send return product email (you can modify this function to include binary data if needed)
//             await sendReturnProductEmail(order, returnReason, binaryImages);
  
//             return res.status(200).json({ message: 'Order returnRequested successfully.' });
//         } catch (error) {
//             console.error('Error returning order:', error);
//             return res.status(500).json({ message: 'An error occurred while returning the order.' });
//         }
//     });
//   };
  

// // Function to send email notification
// async function sendReturnProductEmail(order, returnReason, returnImages) {
//     // Create the email content
//     const adminEmailContent = `
//       Order Return Notification:
  
//       Order ID: ${order.orderId}
//       Customer Name: ${order.billing_name}
//       Customer Email: ${order.billing_email}
  
//       Return Reason: ${returnReason}
  
//       Please review the order return and take any necessary actions.
  
//       Best regards,
//       Elda Appliances
//     `;
  
//     // Prepare attachments if images are provided
//     const attachments = returnImages.map((image, index) => ({
//       filename: `return_image_${index + 1}.png`, // Set a filename for each image
//       content: image.data, // Binary data
//       contentType: image.contentType, // MIME type
//     }));
  
//     // Configure email options
//     const adminMailOptions = {
//       from: 'support@eldaappliances.com',
//       to: 'admin@eldaappliances.com', // Admin email
//       subject: 'Order Return Notification',
//       text: adminEmailContent,
//       attachments, // Add attachments
//     };
  
//     // Send the email
//     try {
//       await transporter.sendMail(adminMailOptions);
//       console.log('Return product email with attachments sent to admin');
//     } catch (error) {
//       console.error('Error sending return email with attachments:', error);
//     }
//   }
  
//   exports.getReturnImages = async (req, res) => {
//     try {
//       // Fetch the order document by ID
//       const order = await Order.findById(req.params.id);
  
//       // Validate if the order exists
//       if (!order || !order.returnImages || order.returnImages.length === 0) {
//         return res.status(404).json({ message: 'No return images found for this order.' });
//       }
  
//       // Map images to include both content type and binary data
//       const images = order.returnImages.map((image, index) => ({
//         index, // To indicate the image index
//         contentType: image.contentType,
//         data: image.data.toString('base64'), // Convert binary data to base64 for easier transmission
//       }));
  
//       // Send all images as JSON
//       res.status(200).json({
//         message: 'Return images fetched successfully.',
//         images,
//       });
//     } catch (error) {
//       console.error('Error fetching return images:', error);
//       res.status(500).json({ message: 'Internal Server Error.' });
//     }
//   };
  

//   // exports.getReturnImages = async (req, res) => {
//   //   try {
//   //     // Fetch the order document by ID
//   //     const order = await Order.findById(req.params.id);
  
//   //     // Validate if the order exists
//   //     if (!order || !order.returnImages || order.returnImages.length === 0) {
//   //       return res.status(404).json({ message: 'No return images found for this order' });
//   //     }
  
//   //     // Get the image index from the query parameter or default to the first image
//   //     const imageIndex = req.query.index ? parseInt(req.query.index, 10) : 0;
  
//   //     // Validate the index
//   //     if (imageIndex < 0 || imageIndex >= order.returnImages.length) {
//   //       return res.status(400).json({ message: 'Invalid image index' });
//   //     }
  
//   //     const image = order.returnImages[imageIndex];
  
//   //     // Send the image with the correct content type
//   //     res.set('Content-Type', image.contentType);
//   //     res.send(image.data);
//   //   } catch (error) {
//   //     console.error('Error fetching return images:', error);
//   //     res.status(500).json({ message: 'Internal Server Error' });
//   //   }
//   // };
  

//   // const fetchReturnImages = async (orderId) => {
//   //   try {
//   //     const response = await fetch(`http://localhost:8080/api/return-order-images/${orderId}`);
//   //     if (!response.ok) {
//   //       console.error('Failed to fetch return images');
//   //       return;
//   //     }
  
//   //     const result = await response.json();
//   //     console.log(result.images); // Array of images with base64 data
//   //   } catch (error) {
//   //     console.error('Error fetching return images:', error);
//   //   }
//   // };
  
//   // // Call the function with an order ID
//   // fetchReturnImages('675190a522e675bb5130f13e');
  
const Order = require('../../models/orderProductModel');
const transporter = require('../../config/nodemailerConfig');
const upload = require('../../config/multerConfig');

// =========================================================================
// 1️⃣ RETURN ORDER CONTROLLER
// =========================================================================
exports.returnOrder = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { orderId, returnReason, productIds, order_status } = req.body;
      const returnImages = req.files; // Array of uploaded files from multer

      // Validate inputs
      if (!orderId || !returnReason || !order_status || !productIds || !returnImages || returnImages.length === 0) {
        return res.status(400).json({
          message: 'Order ID, return reason, at least one product ID, and return images are required.',
        });
      }

      // Find the order by orderId
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      // Check if already requested
      if (order.order_status === 'returnRequested') {
        return res.status(400).json({ message: 'Order is already returnRequested.' });
      }

      // Update `isReturn` field in productDetails
      order.productDetails.forEach((product) => {
        if (productIds.includes(product.productId.toString())) {
          product.isReturn = true;
        }
      });

      // Convert uploaded files to binary data
      const binaryImages = returnImages.map((file) => ({
        data: file.buffer,
        contentType: file.mimetype,
      }));

      // Update order details
      order.order_status = 'returnRequested';
      order.returnReason = returnReason;
      order.returnProducts = productIds;
      order.returnImages = binaryImages;
      order.statusUpdates.push({
        status: 'returnRequested',
        timestamp: new Date(),
      });

      // Save to MongoDB
      await order.save();

      // 🔥 Send return notification emails (Admin & Customer) with attachments & inline photos
      await sendReturnProductEmail(order, returnReason, binaryImages);

      return res.status(200).json({ message: 'Order returnRequested successfully.' });
    } catch (error) {
      console.error('Error returning order:', error);
      return res.status(500).json({ message: 'An error occurred while returning the order.' });
    }
  });
};


// =========================================================================
// 2️⃣ SEND RETURN PRODUCT EMAIL (PREMIUM DESIGN + ATTACHMENTS + CID THUMBNAILS)
// =========================================================================
async function sendReturnProductEmail(order, returnReason, returnImages = []) {
  try {
    const product = order.productDetails?.[0];

    // 1. Prepare attachments (both downloadable & inline CID view)
    const attachments = returnImages.map((image, index) => ({
      filename: `return_proof_${index + 1}.png`,
      content: image.data,
      contentType: image.contentType,
      cid: `return_proof_${index + 1}` // 👈 Inline view for HTML body
    }));

    // 2. Generate inline images thumbnails in HTML table
    let inlineImagesHtml = '';
    if (attachments.length > 0) {
      const imageCells = attachments.map((att, idx) => `
        <td align="center" style="padding: 8px;">
          <div style="border: 2px solid #f0f0f0; border-radius: 8px; overflow: hidden; display: inline-block;">
            <img src="cid:${att.cid}" alt="Proof ${idx + 1}" style="width: 100px; height: 100px; object-fit: cover; display: block;" />
          </div>
          <span style="font-size: 11px; color: #E60000; font-weight: bold; display: block; margin-top: 4px;">Photo #${idx + 1}</span>
        </td>
      `).join('');

      inlineImagesHtml = `
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <tr style="background-color: #fafbfc;">
            <td style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
              Customer Uploaded Proof Photos (${attachments.length})
            </td>
          </tr>
          <tr>
            <td style="padding: 16px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  ${imageCells}
                </tr>
              </table>
              <p style="margin: 8px 0 0; font-size: 11px; color: #888; font-style: italic;">* Images are also attached directly to this email.</p>
            </td>
          </tr>
        </table>
      `;
    }

    // =========================================================================
    // 📩 ADMIN ALERT EMAIL (Details, Inline Photos & Downloadable Attachments)
    // =========================================================================
    const adminMailOptions = {
      from: 'support@reldaindia.com',
      to: 'admin@reldaindia.com',
      subject: `⚠️ Return Request Alert - Order #${order.orderId} | RELDA India Pvt Ltd`,
      attachments,
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
                  
                  <!-- Top White Logo Bar (Crystal Clear Logo) -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 22px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 160px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Admin Alert Header -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 25px; text-align: left; border-left: 6px solid #E60000;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
                        ⚠️ Return Request Submitted - <span style="color: #ff4d4d;">#${order.orderId}</span>
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        A customer has requested a product return. Review details below.
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 26px 24px;">
                      
                      <!-- Details Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Return Request Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Order Reference</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 800; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            #${order.orderId}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Customer Name</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${order.billing_name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Customer Email</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="mailto:${order.billing_email}" style="color: #E60000; text-decoration: none;">${order.billing_email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Customer Phone</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${order.billing_tel || 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Product Name</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product?.productName || 'Product'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Total Order Value</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 800; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ₹${Number(order.totalAmount).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      </table>

                      <!-- Reason for Return Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff9f9; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 22px;">
                        <tr>
                          <td style="padding: 14px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Reason for Return:</span>
                            <div style="font-size: 14px; font-weight: 600; color: #222; margin-top: 4px; line-height: 1.5;">
                              "${returnReason || 'No specific reason provided'}"
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Proof Photos Inline Grid -->
                      ${inlineImagesHtml}

                      <!-- Customer Pickup Address -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase;">Customer Pickup Address:</span>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #333; line-height: 1.5;">${order.shipping_address}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        Please review the return request in the Admin Panel to Accept or Reject.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd.
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

    // =========================================================================
    // 📩 CUSTOMER ACKNOWLEDGMENT EMAIL
    // =========================================================================
    const customerMailOptions = {
      from: 'support@reldaindia.com',
      to: order.billing_email,
      subject: `Return Request Received - Order #${order.orderId} | RELDA India Pvt Ltd`,
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
                  
                  <!-- Top White Logo Bar -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">Return Request Received</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">We are reviewing your request</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${order.billing_name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        We have received your return request for order <strong>#${order.orderId}</strong>. Our quality and support team is currently reviewing your request and uploaded photos.
                      </p>

                      <!-- Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Return Details
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Product</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${product?.productName || 'Product'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Reason</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${returnReason || 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px;">Status</td>
                          <td style="padding: 10px 16px; text-align: right;">
                            <span style="background: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              Under Review
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 20px; font-size: 14px; color: #555; line-height: 1.6;">
                        Our executive will contact you within <strong>24-48 hours</strong> regarding product pickup and refund processing.
                      </p>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Need urgent assistance?
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

    // Send both in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);

    console.log(`✅ Return notification emails sent to Admin & Customer for #${order.orderId}`);
  } catch (error) {
    console.error('❌ Error sending return email with attachments:', error);
  }
}

// =========================================================================
// 3️⃣ GET RETURN IMAGES (BASE64)
// =========================================================================
exports.getReturnImages = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || !order.returnImages || order.returnImages.length === 0) {
      return res.status(404).json({ message: 'No return images found for this order.' });
    }

    const images = order.returnImages.map((image, index) => ({
      index,
      contentType: image.contentType,
      data: image.data.toString('base64'),
    }));

    res.status(200).json({
      message: 'Return images fetched successfully.',
      images,
    });
  } catch (error) {
    console.error('Error fetching return images:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};