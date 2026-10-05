// const orderModel = require("../models/orderProductModel");
// const moment = require("moment");
// const { getZohoSalesOrder } = require("../services/zohoOrder.service");
// const { getInvoiceBySalesOrderId } = require("../services/zohoInvoice.service");
// const { mapZohoStatusToLocal } = require("../utils/statusMapper");
// const transporter = require("../config/nodemailerConfig");

// const sendEmail = async (email, subject, message, type = "html", options = {}) => {
//   if (!email) {
//     console.error("❌ sendEmail skipped: No recipient email");
//     return;
//   }

//   try {
//     await transporter.sendMail({
//       from: `"Relda India Pvt Ltd" <support@reldaindia.com>`,
//       to: email,
//       cc: options.cc || undefined,
//       bcc: options.bcc || undefined,
//       subject,
//       [type]: message,
//     });

//     console.log(`📧 Email sent → ${email} | ${subject}`);
//   } catch (error) {
//     console.error(`❌ Email failed → ${email}`, error.message);
//   }
// };

// exports.syncZohoOrderStatuses = async () => {
//   console.log("🔄 Zoho Order Status Sync Started");

//   // 1️⃣ SMART QUERY: தேவையில்லாத ஆர்டர்கள் மற்றும் Dead ஆர்டர்களைத் தவிர்க்கிறது
//   const orders = await orderModel.find({
//     zohoSalesOrderId: { $exists: true, $ne: null, $nin: ["", null] },
//     zohoSyncError: { $ne: "SO_DOES_NOT_EXIST" }, // 👈 இல்லாத ஆர்டர்களை மீண்டும் மீண்டும் தேடாது
//     order_status: {
//       $nin: [
//         "cancelled",
//         "failed",
//         "returnRequested",
//         "returnAccepted",
//         "returned"
//       ]
//     },
//     // delivered ஆகி invoice-ம் இருந்தால் sync செய்ய தேவையில்லை
//     $or: [
//       { order_status: { $ne: "delivered" } },
//       { zohoInvoiceId: { $in: [null, ""] } }
//     ]
//   });

//   console.log(`📦 Orders to sync: ${orders.length}`);

//   let updatedCount = 0;
//   let emailSentCount = 0;
//   let skippedReturnCount = 0;
//   let invoiceLinkedCount = 0;
//   let deadOrdersCount = 0;

//   for (const order of orders) {
//     try {
//       /* 🔒 SKIP RETURN FLOW ORDERS */
//       if (["returnRequested", "returnAccepted", "returned"].includes(order.order_status)) {
//         skippedReturnCount++;
//         continue;
//       }

//       // 2️⃣ FETCH ZOHO SALES ORDER
//       const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

//       if (!zohoOrder) {
//         continue;
//       }

//       const newStatus = mapZohoStatusToLocal(zohoOrder, order.order_status);

//       /* ---------------- STATUS CHANGE DETECT ---------------- */
//       if (newStatus && newStatus !== order.order_status) {
//         const oldStatus = order.order_status;
//         const now = new Date();

//         // auto insert packaged if Zoho skipped
//         if (newStatus === "shipped" && oldStatus === "ordered") {
//           order.statusUpdates.push({
//             status: "packaged",
//             updatedAt: now
//           });
//         }

//         order.order_status = newStatus;
//         order.statusUpdatedAt = now;

//         order.statusUpdates.push({
//           status: newStatus,
//           updatedAt: now
//         });

//         updatedCount++;

//         /* ---------------- EMAIL TRIGGER ---------------- */
//         let emailSubject = "";
//         let emailMessage = "";
//         const formattedTimestamp = moment(now).format("hh:mm A");

//         switch (newStatus) {
//           case "packaged":
//             emailSubject = "Your Order is Packed and Ready for Shipping";
//             emailMessage = `
//               <p>Dear <strong>${order.billing_name}</strong>,</p>
//               <p>Your order has been packed and is ready for shipping.</p>
//               <ul>
//                 <li><strong>Product</strong>: ${order.productDetails[0]?.productName || "Your product"}</li>
//                 <li><strong>Order No</strong>: ${order.orderId}</li>
//                 <li><strong>Status Updated</strong>: ${formattedTimestamp}</li>
//               </ul>
//               <p>Thank you for shopping with <strong>Relda India</strong>.</p>
//               <p>Warm regards,<br><strong>Relda India Team</strong></p>
//             `;
//             break;

//           case "shipped":
//             emailSubject = "Your Product Has Been Shipped";
//             emailMessage = `
//               <p>Dear <strong>${order.billing_name}</strong>,</p>
//               <p>Your product has been shipped.</p>
//               <ul>
//                 <li><strong>Order No</strong>: ${order.orderId}</li>
//                 <li><strong>Status Updated</strong>: ${formattedTimestamp}</li>
//               </ul>
//               <p>Warm regards,<br><strong>Relda India Team</strong></p>
//             `;
//             break;

//           case "delivered":
//             emailSubject = "Order Delivered Successfully";
//             emailMessage = `
//               <p>Dear <strong>${order.billing_name}</strong>,</p>
//               <p>Your order has been delivered successfully.</p>
//               <ul>
//                 <li><strong>Order No</strong>: ${order.orderId}</li>
//                 <li><strong>Delivered At</strong>: ${formattedTimestamp}</li>
//               </ul>
//               <p>Thank you for choosing <strong>Relda India</strong>.</p>
//               <p>Warm regards,<br><strong>Relda India Team</strong></p>
//             `;
//             break;
//         }

//         if (emailSubject && order.billing_email) {
//           try {
//             await sendEmail(order.billing_email, emailSubject, emailMessage, "html");
//             emailSentCount++;
//           } catch (mailErr) {
//             console.error(`❌ Email failed for order ${order.orderId}:`, mailErr.message);
//           }
//         }
//       }

//       /* ---------------- INVOICE LINK ---------------- */
//       if (!order.zohoInvoiceId) {
//         const invoice = await getInvoiceBySalesOrderId(order.zohoSalesOrderId);
//         if (invoice) {
//           order.zohoInvoiceId = invoice.invoice_id;
//           invoiceLinkedCount++;
//         }
//       }

//       await order.save();

//     } catch (err) {
//       const errCode = err.response?.data?.code || err.code;
//       const errMsg = err.response?.data?.message || err.message;

//       // 🚨 ZOHO CODE 1002 (Sales Order does not exist / Deleted) HANDLING
//       if (errCode === 1002 || err.response?.status === 404) {
//         console.warn(`⚠️ Sales Order ${order.zohoSalesOrderId} not found in Zoho. Disabling future sync for order ${order.orderId}.`);
        
//         order.zohoSyncError = "SO_DOES_NOT_EXIST";
//         await order.save().catch(() => {});
//         deadOrdersCount++;
//       } else {
//         console.error(`❌ Sync failed for order ${order.orderId}:`, errMsg);
//       }
//     }
//   }

//   /* ---------------- SUMMARY LOG ---------------- */
//   console.log("✅ Zoho Order Status Sync Completed");
//   console.log("📊 Summary:");
//   console.log(`   🔄 Status Updated        : ${updatedCount}`);
//   console.log(`   📧 Emails Sent           : ${emailSentCount}`);
//   console.log(`   🔒 Return Locked Skipped : ${skippedReturnCount}`);
//   console.log(`   🧾 Invoices Linked       : ${invoiceLinkedCount}`);
//   if (deadOrdersCount > 0) {
//     console.log(`   ⚠️ Dead SOs Flagged      : ${deadOrdersCount}`);
//   }
// };/
const orderModel = require("../models/orderProductModel");
const moment = require("moment");
const { getZohoSalesOrder } = require("../services/zohoOrder.service");
const { getInvoiceBySalesOrderId } = require("../services/zohoInvoice.service");
const { mapZohoStatusToLocal } = require("../utils/statusMapper");
const transporter = require("../config/nodemailerConfig");

const sendEmail = async (email, subject, message, type = "html", options = {}) => {
  if (!email) {
    console.error("❌ sendEmail skipped: No recipient email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"RELDA India Pvt Ltd" <support@reldaindia.com>`,
      to: email,
      cc: options.cc || undefined,
      bcc: options.bcc || undefined,
      subject,
      [type]: message,
    });

    console.log(`📧 Email sent → ${email} | ${subject}`);
  } catch (error) {
    console.error(`❌ Email failed → ${email}`, error.message);
  }
};

// 🔥 STATUS EMAIL TEMPLATE GENERATOR (PREMIUM DESIGN WITH LOGO & BRAND COLORS)
const generateStatusEmailHtml = ({ order, title, subtitle, statusText, statusBadgeColor, statusTextColor, timeLabel, formattedTimestamp, noteText }) => {
  const product = order.productDetails?.[0];
  const productName = product?.productName || "Your Product";
  const quantity = product?.quantity || 1;

  const serialRow = order.serialNumber ? `
    <tr>
      <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Serial Number</td>
      <td style="padding: 12px 16px; color: #111; font-weight: bold; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
        ${order.serialNumber}
      </td>
    </tr>
  ` : '';

  return `
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
              
              <!-- 1️⃣ Top Logo Bar (White Background - 100% Crystal Clear Logo) -->
              <tr>
                <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                  <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                </td>
              </tr>

              <!-- 2️⃣ Brand Hero Banner (#E60000 Gradient) -->
              <tr>
                <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">${title}</h1>
                  <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">${subtitle}</p>
                </td>
              </tr>

              <!-- 3️⃣ Body Content -->
              <tr>
                <td style="padding: 30px 25px;">
                  
                  <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                    Dear ${order.billing_name},
                  </p>
                  <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                    ${noteText}
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

                  <!-- Order Status Summary Table -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                    <tr style="background-color: #fafbfc;">
                      <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #eef0f2;">
                        Order Status Details
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Product Name</td>
                      <td style="padding: 12px 16px; color: #111; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                        ${productName}
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Quantity</td>
                      <td style="padding: 12px 16px; color: #111; font-weight: bold; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                        ${quantity} unit(s)
                      </td>
                    </tr>
                    ${serialRow}
                    <tr>
                      <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">Current Status</td>
                      <td style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                        <span style="background: ${statusBadgeColor}; color: ${statusTextColor}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                          ${statusText}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 16px; color: #666; font-size: 14px; border-bottom: 1px solid #f0f0f0;">${timeLabel}</td>
                      <td style="padding: 12px 16px; color: #111; font-weight: 600; font-size: 14px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                        ${formattedTimestamp}
                      </td>
                    </tr>
                    <tr style="background-color: #fff9f9;">
                      <td style="padding: 14px 16px; color: #111; font-size: 15px; font-weight: 700;">Total Amount</td>
                      <td style="padding: 14px 16px; color: #E60000; font-weight: 800; font-size: 18px; text-align: right;">
                        ₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </table>

                  <!-- Shipping Address Box -->
                  ${order.shipping_address ? `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 12px; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px 18px;">
                          <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</span>
                          <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">${order.shipping_address}</p>
                        </td>
                      </tr>
                    </table>
                  ` : ''}

                  <!-- Support Box -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 16px 18px;">
                        <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                          Need assistance with your delivery?
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
  `;
};

exports.syncZohoOrderStatuses = async () => {
  console.log("🔄 Zoho Order Status Sync Started");

  const orders = await orderModel.find({
    zohoSalesOrderId: { $exists: true, $ne: null, $nin: ["", null] },
    zohoSyncError: { $ne: "SO_DOES_NOT_EXIST" },
    order_status: {
      $nin: [
        "cancelled",
        "failed",
        "returnRequested",
        "returnAccepted",
        "returned"
      ]
    },
    $or: [
      { order_status: { $ne: "delivered" } },
      { zohoInvoiceId: { $in: [null, ""] } }
    ]
  });

  console.log(`📦 Orders to sync: ${orders.length}`);

  let updatedCount = 0;
  let emailSentCount = 0;
  let skippedReturnCount = 0;
  let invoiceLinkedCount = 0;
  let deadOrdersCount = 0;

  for (const order of orders) {
    try {
      if (["returnRequested", "returnAccepted", "returned"].includes(order.order_status)) {
        skippedReturnCount++;
        continue;
      }

      const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

      if (!zohoOrder) {
        continue;
      }

      const newStatus = mapZohoStatusToLocal(zohoOrder, order.order_status);

      /* ---------------- STATUS CHANGE DETECT ---------------- */
      if (newStatus && newStatus !== order.order_status) {
        const oldStatus = order.order_status;
        const now = new Date();

        if (newStatus === "shipped" && oldStatus === "ordered") {
          order.statusUpdates.push({
            status: "packaged",
            updatedAt: now
          });
        }

        order.order_status = newStatus;
        order.statusUpdatedAt = now;

        order.statusUpdates.push({
          status: newStatus,
          updatedAt: now
        });

        updatedCount++;

        /* ---------------- EMAIL TRIGGER ---------------- */
        let emailSubject = "";
        let emailMessage = "";
        const formattedTimestamp = moment(now).format("DD MMM YYYY, hh:mm A");

        switch (newStatus) {
          case "packaged":
            emailSubject = `Your Order is Packed & Ready - #${order.orderId} | RELDA India Pvt Ltd`;
            emailMessage = generateStatusEmailHtml({
              order,
              title: "Order Packed & Ready!",
              subtitle: "Your package is prepared for dispatch",
              statusText: "Packed & Ready",
              statusBadgeColor: "#e3f2fd",
              statusTextColor: "#1565c0",
              timeLabel: "Packed At",
              formattedTimestamp,
              noteText: "Great news! Your order has been securely packed and is ready for dispatch from our warehouse."
            });
            break;

          case "shipped":
            emailSubject = `Your Order Has Been Shipped - #${order.orderId} | RELDA India Pvt Ltd`;
            emailMessage = generateStatusEmailHtml({
              order,
              title: "Order Shipped! 🚚",
              subtitle: "Your package is on its way to you",
              statusText: "Shipped / In Transit",
              statusBadgeColor: "#ede7f6",
              statusTextColor: "#512da8",
              timeLabel: "Shipped At",
              formattedTimestamp,
              noteText: "Your product has been dispatched and is currently on its way to your delivery address."
            });
            break;

          case "delivered":
            emailSubject = `Order Delivered Successfully - #${order.orderId} | RELDA India Pvt Ltd`;
            emailMessage = generateStatusEmailHtml({
              order,
              title: "Order Delivered! 🎉",
              subtitle: "Thank you for choosing RELDA",
              statusText: "Delivered",
              statusBadgeColor: "#e8f5e9",
              statusTextColor: "#2e7d32",
              timeLabel: "Delivered At",
              formattedTimestamp,
              noteText: "Your package has been successfully delivered! We hope you love your new appliance."
            });
            break;
        }

        if (emailSubject && order.billing_email) {
          try {
            await sendEmail(order.billing_email, emailSubject, emailMessage, "html");
            emailSentCount++;
          } catch (mailErr) {
            console.error(`❌ Email failed for order ${order.orderId}:`, mailErr.message);
          }
        }
      }

      /* ---------------- INVOICE LINK ---------------- */
      if (!order.zohoInvoiceId) {
        const invoice = await getInvoiceBySalesOrderId(order.zohoSalesOrderId);
        if (invoice) {
          order.zohoInvoiceId = invoice.invoice_id;
          invoiceLinkedCount++;
        }
      }

      await order.save();

    } catch (err) {
      const errCode = err.response?.data?.code || err.code;
      const errMsg = err.response?.data?.message || err.message;

      if (errCode === 1002 || err.response?.status === 404) {
        console.warn(`⚠️ Sales Order ${order.zohoSalesOrderId} not found in Zoho. Disabling future sync for order ${order.orderId}.`);
        
        order.zohoSyncError = "SO_DOES_NOT_EXIST";
        await order.save().catch(() => {});
        deadOrdersCount++;
      } else {
        console.error(`❌ Sync failed for order ${order.orderId}:`, errMsg);
      }
    }
  }

  /* ---------------- SUMMARY LOG ---------------- */
  console.log("✅ Zoho Order Status Sync Completed");
  console.log("📊 Summary:");
  console.log(`   🔄 Status Updated        : ${updatedCount}`);
  console.log(`   📧 Emails Sent           : ${emailSentCount}`);
  console.log(`   🔒 Return Locked Skipped : ${skippedReturnCount}`);
  console.log(`   🧾 Invoices Linked       : ${invoiceLinkedCount}`);
  if (deadOrdersCount > 0) {
    console.log(`   ⚠️ Dead SOs Flagged      : ${deadOrdersCount}`);
  }
};