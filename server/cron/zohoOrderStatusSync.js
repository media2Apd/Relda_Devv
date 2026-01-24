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
const orderModel = require("../models/orderProductModel");
const { getZohoSalesOrder } = require("../services/zohoOrder.service");
const { getInvoiceBySalesOrderId } = require("../services/zohoInvoice.service");
const { mapZohoStatusToLocal } = require("../utils/statusMapper");

exports.syncZohoOrderStatuses = async () => {
  console.log("🔄 Zoho Order Status Sync Started");

  const orders = await orderModel.find({
    zohoSalesOrderId: { $exists: true }
  });

  console.log(`📦 Orders to sync: ${orders.length}`);

  for (const order of orders) {
    try {
      const zohoOrder = await getZohoSalesOrder(order.zohoSalesOrderId);

      console.log("\n==============================");
      console.log(`🧾 ORDER ID: ${order.orderId}`);
      console.log(`📦 LOCAL STATUS: ${order.order_status}`);
      console.log("🌐 ZOHO STATUS SNAPSHOT:", zohoOrder);

      /* ---------------- STATUS MAP ---------------- */
      const newStatus = mapZohoStatusToLocal(
        zohoOrder,
        order.order_status
      );

      if (newStatus !== order.order_status) {
        // auto insert packaged if skipped
        if (
          newStatus === "shipped" &&
          order.order_status === "ordered"
        ) {
          order.statusUpdates.push({
            status: "packaged",
            updatedAt: new Date()
          });
        }

        order.order_status = newStatus;
        order.statusUpdatedAt = new Date();

        order.statusUpdates.push({
          status: newStatus,
          updatedAt: new Date()
        });
      }

      /* ---------------- INVOICE SYNC ---------------- */
      if (!order.zohoInvoiceId) {
        const invoice = await getInvoiceBySalesOrderId(
          order.zohoSalesOrderId
        );

        if (invoice) {
          console.log("🧾 Invoice Found:", invoice.invoice_id);

          order.zohoInvoiceId = invoice.invoice_id;
        //   order.paymentDetails.payment_status =
        //     invoice.status === "paid" ? "success" : "pending";
        }
      }

      await order.save();

      console.log("✅ STATUS / INVOICE SYNC COMPLETED");

    } catch (err) {
      console.error(
        `❌ Sync failed for order ${order.orderId}`,
        err.response?.data || err.message
      );
    }
  }

  console.log("\n✅ Zoho Order Status Sync Completed");
};
