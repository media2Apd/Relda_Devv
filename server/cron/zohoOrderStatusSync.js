// const orderModel = require("../models/orderProductModel");
// const { getZohoSalesOrder } = require("../services/zohoOrder.service");
// const { mapZohoStatusToLocal } = require("../utils/statusMapper");
// const { getInvoiceBySalesOrder } = require("../services/zohoInvoice.service");

// // exports.syncZohoOrderStatuses = async () => {
// //   console.log("🔄 Zoho Order Status Sync Started");

// //   const orders = await orderModel.find({
// //     zohoSalesOrderId: { $exists: true }
// //   });

// //   console.log(`📦 Orders to sync: ${orders.length}`);

// //   for (const order of orders) {
// //     try {
// //       const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

// //       console.log("\n==============================");
// //       console.log(`🧾 ORDER ID: ${order.orderId}`);
// //       console.log(`📦 LOCAL STATUS: ${order.order_status}`);
// //       console.log("🌐 ZOHO STATUS SNAPSHOT:", {
// //         status: zohoOrder.status
// //       });

// //       const newStatus = mapZohoStatusToLocal(
// //         zohoOrder,
// //         order.order_status
// //       );

// //       console.log(`🧭 MAPPED STATUS: ${newStatus}`);

// //       // 🚫 PREVENT BACKWARD OR SAME STATUS UPDATE
// //       if (newStatus === order.order_status) {
// //         console.log("⏭ NO CHANGE – SKIPPED");
// //         continue;
// //       }

// //       console.log(
// //         `🔁 UPDATING: ${order.order_status} → ${newStatus}`
// //       );
// //       if (newStatus === "shipped" && order.order_status === "ordered") {
// //   console.log("⚠ Missing PACKAGED — inserting automatically");

// //   order.statusUpdates.push({
// //     status: "packaged",
// //     updatedAt: new Date()
// //   });
// // }


// //       order.order_status = newStatus;
// //       order.statusUpdatedAt = new Date();

// //       order.statusUpdates.push({
// //         status: newStatus,
// //         updatedAt: new Date()
// //       });

// //       await order.save();

// //       console.log("✅ STATUS & HISTORY SAVED");

// //     } catch (err) {
// //       console.error(
// //         `❌ Sync failed for order ${order.orderId}`,
// //         err.response?.data || err.message
// //       );
// //     }
// //   }

// //   console.log("\n✅ Zoho Order Status Sync Completed");
// // };
// exports.syncZohoOrderStatuses = async () => {
//   console.log("🔄 Zoho Order Status Sync Started");

//   const orders = await orderModel.find({
//     zohoSalesOrderId: { $exists: true }
//   });

//   console.log(`📦 Orders to sync: ${orders.length}`);

//   for (const order of orders) {
//     try {
//       const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

//       console.log("\n==============================");
//       console.log(`🧾 ORDER ID: ${order.orderId}`);
//       console.log(`📦 LOCAL STATUS: ${order.order_status}`);
//       console.log("🌐 ZOHO STATUS SNAPSHOT:", zohoOrder);

//       const newStatus = mapZohoStatusToLocal(
//         zohoOrder,
//         order.order_status
//       );

//       console.log(`🧭 MAPPED STATUS: ${newStatus}`);

//       /* ---------------- STATUS UPDATE ---------------- */

//       if (newStatus !== order.order_status) {

//         // Auto insert PACKAGED if skipped
//         if (
//           newStatus === "shipped" &&
//           order.order_status === "ordered"
//         ) {
//           console.log("⚠ Missing PACKAGED — inserting automatically");
//           order.statusUpdates.push({
//             status: "packaged",
//             updatedAt: new Date()
//           });
//         }

//         order.order_status = newStatus;
//         order.statusUpdatedAt = new Date();

//         order.statusUpdates.push({
//           status: newStatus,
//           updatedAt: new Date()
//         });
//       }

//       /* ---------------- INVOICE SYNC ---------------- */

//       if (
//         zohoOrder.invoice_status === "invoiced" &&
//         !order.zohoInvoiceId
//       ) {
//         console.log("🧾 Invoice detected in Zoho. Fetching invoice_id...");

//         const invoice = await getInvoiceBySalesOrder(
//           order.zohoSalesOrderId
//         );

//         if (invoice) {
//           order.zohoInvoiceId = invoice.invoice_id;
//           console.log("✅ Invoice ID stored:", invoice.invoice_id);
//         }
//       }

//       await order.save();
//       console.log("✅ STATUS / INVOICE SYNC COMPLETED");

//     } catch (err) {
//       console.error(
//         `❌ Sync failed for order ${order.orderId}`,
//         err.response?.data || err.message
//       );
//     }
//   }

//   console.log("\n✅ Zoho Order Status Sync Completed");
// };
// const orderModel = require("../models/orderProductModel");
// const { getZohoSalesOrder } = require("../services/zohoOrder.service");
// const { getInvoiceBySalesOrderId } = require("../services/zohoInvoice.service");
// const { mapZohoStatusToLocal } = require("../utils/statusMapper");

// exports.syncZohoOrderStatuses = async () => {
//   console.log("🔄 Zoho Order Status Sync Started");

//   const orders = await orderModel.find({
//     zohoSalesOrderId: { $exists: true }
//   });

//   console.log(`📦 Orders to sync: ${orders.length}`);

//   for (const order of orders) {
//     try {
//       const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

//       console.log("\n==============================");
//       console.log(`🧾 ORDER ID: ${order.orderId}`);
//       console.log(`📦 LOCAL STATUS: ${order.order_status}`);
//       console.log("🌐 ZOHO STATUS SNAPSHOT:", zohoOrder);

//       /* ---------------- STATUS MAP ---------------- */
//       const newStatus = mapZohoStatusToLocal(
//         zohoOrder,
//         order.order_status
//       );

//       if (newStatus !== order.order_status) {
//         // auto insert packaged if skipped
//         if (
//           newStatus === "shipped" &&
//           order.order_status === "ordered"
//         ) {
//           order.statusUpdates.push({
//             status: "packaged",
//             updatedAt: new Date()
//           });
//         }

//         order.order_status = newStatus;
//         order.statusUpdatedAt = new Date();

//         order.statusUpdates.push({
//           status: newStatus,
//           updatedAt: new Date()
//         });
//       }

//       /* ---------------- INVOICE SYNC ---------------- */
//       if (!order.zohoInvoiceId) {
//         const invoice = await getInvoiceBySalesOrderId(
//           order.zohoSalesOrderId
//         );

//         if (invoice) {
//           console.log("🧾 Invoice Found:", invoice.invoice_id);

//           order.zohoInvoiceId = invoice.invoice_id;
//         //   order.paymentDetails.payment_status =
//         //     invoice.status === "paid" ? "success" : "pending";
//         }
//       }

//       await order.save();

//       console.log("✅ STATUS / INVOICE SYNC COMPLETED");

//     } catch (err) {
//       console.error(
//         `❌ Sync failed for order ${order.orderId}`,
//         err.response?.data || err.message
//       );
//     }
//   }

//   console.log("\n✅ Zoho Order Status Sync Completed");
// };
const orderModel = require("../models/orderProductModel");
const moment = require("moment");
const { getZohoSalesOrder } = require("../services/zohoOrder.service");
const { getInvoiceBySalesOrderId } = require("../services/zohoInvoice.service");
const { mapZohoStatusToLocal } = require("../utils/statusMapper");
const transporter = require('../config/nodemailerConfig')
const sendEmail = async (
  email,
  subject,
  message,
  type = "html",        // future use (text / html)
  options = {}          // cc, bcc support
) => {
  if (!email) {
    console.error("❌ sendEmail skipped: No recipient email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Relda India" <admin@reldaindia.com>`, // ✅ branding
      to: email,
      cc: options.cc || undefined,
      bcc: options.bcc || undefined,
      subject,
      [type]: message, // html or text
    });

    console.log(`📧 Email sent → ${email} | ${subject}`);
  } catch (error) {
    console.error(
      `❌ Email failed → ${email}`,
      error.message
    );
  }
};



// exports.syncZohoOrderStatuses = async () => {
//   console.log("🔄 Zoho Order Status Sync Started");

//   const orders = await orderModel.find({
//     zohoSalesOrderId: { $exists: true }
//   });

//   console.log(`📦 Orders to sync: ${orders.length}`);

//   let updatedCount = 0;
//   let skippedReturnCount = 0;
//   let invoiceLinkedCount = 0;

//   for (const order of orders) {
//     try {
//       /* 🔒 SKIP RETURN FLOW ORDERS */
//       if (
//         ["returnRequested", "returnAccepted", "returned"].includes(
//           order.order_status
//         )
//       ) {
//         skippedReturnCount++;
//         continue;
//       }

//       const zohoOrder = await getZohoSalesOrder(
//         order.zohoSalesOrderId
//       );

//       const newStatus = mapZohoStatusToLocal(
//         zohoOrder,
//         order.order_status
//       );

//       /* ---------------- STATUS UPDATE ---------------- */
//       if (newStatus !== order.order_status) {

//         // auto insert packaged if Zoho skipped
//         if (
//           newStatus === "shipped" &&
//           order.order_status === "ordered"
//         ) {
//           order.statusUpdates.push({
//             status: "packaged",
//             updatedAt: new Date()
//           });
//         }

//         order.order_status = newStatus;
//         order.statusUpdatedAt = new Date();

//         order.statusUpdates.push({
//           status: newStatus,
//           updatedAt: new Date()
//         });

//         updatedCount++;
//       }

//       /* ---------------- INVOICE LINK ---------------- */
//       if (!order.zohoInvoiceId) {
//         const invoice = await getInvoiceBySalesOrderId(
//           order.zohoSalesOrderId
//         );

//         if (invoice) {
//           order.zohoInvoiceId = invoice.invoice_id;
//           invoiceLinkedCount++;
//         }
//       }

//       await order.save();

//     } catch (err) {
//       console.error(
//         `❌ Sync failed for order ${order.orderId}`,
//         err.response?.data || err.message
//       );
//     }
//   }

//   /* ✅ FINAL SUMMARY LOG ONLY */
//   console.log("✅ Zoho Order Status Sync Completed");
//   console.log("📊 Summary:");
//   console.log(`   🔄 Updated Orders       : ${updatedCount}`);
//   console.log(`   🔒 Return Locked Skipped: ${skippedReturnCount}`);
//   console.log(`   🧾 Invoices Linked      : ${invoiceLinkedCount}`);
// };
exports.syncZohoOrderStatuses = async () => {
  console.log("🔄 Zoho Order Status Sync Started");

  const orders = await orderModel.find({
    zohoSalesOrderId: { $exists: true }
  });

  console.log(`📦 Orders to sync: ${orders.length}`);

  let updatedCount = 0;
  let emailSentCount = 0;
  let skippedReturnCount = 0;
  let invoiceLinkedCount = 0;

  for (const order of orders) {
    try {
      /* 🔒 SKIP RETURN FLOW */
      if (
        ["returnRequested", "returnAccepted", "returned"].includes(
          order.order_status
        )
      ) {
        skippedReturnCount++;
        continue;
      }

      const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

      const newStatus = mapZohoStatusToLocal(
        zohoOrder,
        order.order_status
      );

      /* ---------------- STATUS CHANGE DETECT ---------------- */
      if (newStatus !== order.order_status) {
        const oldStatus = order.order_status;
        const now = new Date();

        // auto insert packaged if Zoho skipped
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
        const formattedTimestamp = moment(now).format("hh:mm A");

        switch (newStatus) {
          case "packaged":
            emailSubject = "Your Order is Packed and Ready for Shipping";
            emailMessage = `
              <p>Dear <strong>${order.billing_name}</strong>,</p>
              <p>Your order has been packed and is ready for shipping.</p>
              <ul>
                <li><strong>Product</strong>: ${order.productDetails[0]?.productName || "Your product"}</li>
                <li><strong>Order No</strong>: ${order.orderId}</li>
                <li><strong>Status Updated</strong>: ${formattedTimestamp}</li>
              </ul>
              <p>Thank you for shopping with <strong>Relda India</strong>.</p>
              <p>Warm regards,<br><strong>Relda India Team</strong></p>
            `;
            break;

          case "shipped":
            emailSubject = "Your Product Has Been Shipped";
            emailMessage = `
              <p>Dear <strong>${order.billing_name}</strong>,</p>
              <p>Your product has been shipped.</p>
              <ul>
                <li><strong>Order No</strong>: ${order.orderId}</li>
                <li><strong>Status Updated</strong>: ${formattedTimestamp}</li>
              </ul>
              <p>Warm regards,<br><strong>Relda India Team</strong></p>
            `;
            break;

          case "delivered":
            emailSubject = "Order Delivered Successfully";
            emailMessage = `
              <p>Dear <strong>${order.billing_name}</strong>,</p>
              <p>Your order has been delivered successfully.</p>
              <ul>
                <li><strong>Order No</strong>: ${order.orderId}</li>
                <li><strong>Delivered At</strong>: ${formattedTimestamp}</li>
              </ul>
              <p>Thank you for choosing <strong>Relda India</strong>.</p>
              <p>Warm regards,<br><strong>Relda India Team</strong></p>
            `;
            break;
        }

        if (emailSubject && order.billing_email) {
          try {
            await sendEmail(
              order.billing_email,
              emailSubject,
              emailMessage,
              "html"
            );
            emailSentCount++;
          } catch (mailErr) {
            console.error(
              `❌ Email failed for order ${order.orderId}`,
              mailErr.message
            );
          }
        }
      }

      /* ---------------- INVOICE LINK ---------------- */
      if (!order.zohoInvoiceId) {
        const invoice = await getInvoiceBySalesOrderId(
          order.zohoSalesOrderId
        );

        if (invoice) {
          order.zohoInvoiceId = invoice.invoice_id;
          invoiceLinkedCount++;
        }
      }

      await order.save();

    } catch (err) {
      console.error(
        `❌ Sync failed for order ${order.orderId}`,
        err.response?.data || err.message
      );
    }
  }

  /* ---------------- SUMMARY LOG ---------------- */
  console.log("✅ Zoho Order Status Sync Completed");
  console.log("📊 Summary:");
  console.log(`   🔄 Status Updated        : ${updatedCount}`);
  console.log(`   📧 Emails Sent           : ${emailSentCount}`);
  console.log(`   🔒 Return Locked Skipped : ${skippedReturnCount}`);
  console.log(`   🧾 Invoices Linked       : ${invoiceLinkedCount}`);
};