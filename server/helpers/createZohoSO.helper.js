// const productModel = require("../models/productModel");
// const { createZohoSalesOrder } = require("../services/zohoSalesOrder.service");

// module.exports = async function createSalesOrderAndReleaseStock(order, user) {
//   if (!order || !order.orderId) {
//     throw new Error("Order not found for Zoho Sales Order creation");
//   }

//   // Prepare products for Zoho
//   const products = await Promise.all(
//     order.productDetails.map(async (p) => {
//       const prod = await productModel.findById(p.productId);

//       if (!prod?.zohoVariantId) {
//         throw new Error(`Zoho Variant ID missing for product ${p.productId}`);
//       }

//       return {
//         zohoVariantId: prod.zohoVariantId, // Zoho Inventory item_id
//         quantity: p.quantity,
//         sellingPrice: p.sellingPrice
//       };
//     })
//   );

//   // 🔥 CREATE ZOHO SALES ORDER (API call happens INSIDE service)
//   const zohoSO = await createZohoSalesOrder({
//     user,
//     order,
//     products
//   });

//   // Save Zoho Sales Order ID
//   order.zohoSalesOrderId = zohoSO.salesorder_id;
//   await order.save();

//   // 🔓 RELEASE RESERVED STOCK
//   for (const p of order.productDetails) {
//     await productModel.findByIdAndUpdate(
//       p.productId,
//       { $inc: { reservedStock: -p.quantity } }
//     );
//   }

//   return zohoSO;
// };
// const productModel = require("../models/productModel");
// const {
//   createZohoSalesOrder,
//   confirmZohoSalesOrder,
//   createInvoiceFromSalesOrder,
//   recordZohoPayment
// } = require("../services/zohoSalesOrder.service");

// module.exports = async function createSalesOrderAndReleaseStock(order, user) {
//   if (!order || !order.orderId) {
//     throw new Error("Order not found for Zoho Sales Order creation");
//   }

//   if (!user?.zohoCustomerId) {
//     throw new Error("Zoho customer not linked for this user");
//   }

//   // ===============================
//   // 1️⃣ PREPARE PRODUCTS
//   // ===============================
//   const products = await Promise.all(
//     order.productDetails.map(async (p) => {
//       const prod = await productModel.findById(p.productId);

//       if (!prod?.zohoVariantId) {
//         throw new Error(`Zoho Variant ID missing for product ${p.productId}`);
//       }

//       return {
//         zohoVariantId: prod.zohoVariantId,
//         quantity: p.quantity,
//         sellingPrice: p.sellingPrice
//       };
//     })
//   );

//   // ===============================
//   // 2️⃣ CREATE SALES ORDER
//   // ===============================
//   console.log("🟡 Creating Zoho Sales Order...");
//   const zohoSO = await createZohoSalesOrder({
//     user,
//     order,
//     products
//   });

//   console.log("🟡 Sales Order Created:", zohoSO.salesorder_id);

//   // ===============================
//   // 3️⃣ CONFIRM SALES ORDER (MANDATORY)
//   // ===============================
//   console.log("🟡 Confirming Zoho Sales Order...");
//   await confirmZohoSalesOrder(zohoSO.salesorder_id);

//   // ===============================
//   // 4️⃣ SAVE SALES ORDER ID IN DB ✅
//   // ===============================
//   order.zohoSalesOrderId = zohoSO.salesorder_id;
//   order.order_status = "ordered";
//   order.statusUpdates.push({
//     status: "ordered",
//     updatedAt: new Date()
//   });
//   await order.save();

//   // ===============================
//   // 5️⃣ RELEASE RESERVED STOCK
//   // ===============================
//   for (const p of order.productDetails) {
//     await productModel.findByIdAndUpdate(
//       p.productId,
//       { $inc: { reservedStock: -p.quantity } }
//     );
//   }

//   console.log("🟢 Reserved stock released");

//   return zohoSO;
// };

// const productModel = require("../models/productModel");
// const {
//   createZohoSalesOrder,
//   confirmZohoSalesOrder,
//   createInvoiceFromSalesOrder,
//   recordZohoPayment
// } = require("../services/zohoSalesOrder.service");

// module.exports = async function createSalesOrderAndReleaseStock(order, user) {
//   // Prepare products
//   const products = await Promise.all(
//     order.productDetails.map(async (p) => {
//       const prod = await productModel.findById(p.productId);
//       return {
//         zohoVariantId: prod.zohoVariantId,
//         quantity: p.quantity,
//         sellingPrice: p.sellingPrice
//       };
//     })
//   );

//   // 1️⃣ Create Sales Order
//   const so = await createZohoSalesOrder({ user, order, products });
//   order.zohoSalesOrderId = so.salesorder_id;
//   // 2️⃣ Confirm Sales Order
//   await confirmZohoSalesOrder(so.salesorder_id);

//   // 3️⃣ Create Invoice
//   const invoice = await createInvoiceFromSalesOrder(so.salesorder_id);

//   // 4️⃣ Mark Invoice as PAID
//   const payment = await recordZohoPayment({
//     invoiceId: invoice.invoice_id,
//     amount: invoice.total,
//     paymentId: order.paymentDetails.trackingId
//   });

//   // 5️⃣ Save Zoho refs

//   order.zohoInvoiceId = invoice.invoice_id;
//   order.zohoPaymentId = payment.payment_id;
//   order.paymentDetails.payment_status = "paid";
//   order.order_status = "ordered";

//   await order.save();

//   // Release reserved stock
//   for (const p of order.productDetails) {
//     await productModel.findByIdAndUpdate(
//       p.productId,
//       { $inc: { reservedStock: -p.quantity } }
//     );
//   }
// };

const productModel = require('../models/productModel');
const {
  createZohoSalesOrder,
  confirmZohoSalesOrder,
  createInvoiceFromSalesOrder,
  recordZohoPayment,
} = require('../services/zohoSalesOrder.service');

/**
 * 1.  Create Sales-Order in Zoho
 * 2.  Confirm it
 * 3.  Create Invoice
 * 4.  Mark it paid
 * 5.  Persist Zoho IDs in our Order document
 * 6.  Release reserved stock
 */
module.exports = async function createSalesOrderAndReleaseStock(order, user) {
  /* ------------------------ Prepare line-items ------------------------ */
  const products = await Promise.all(
    order.productDetails.map(async p => {
      const prod = await productModel.findById(p.productId);
      return {
        zohoVariantId: prod.zohoVariantId,
        quantity     : p.quantity,
        sellingPrice : p.sellingPrice,
      };
    }),
  );

  /* -------------------------- Zoho calls ----------------------------- */
  const so      = await createZohoSalesOrder({ user, order, products });
  await confirmZohoSalesOrder(so.salesorder_id);
  // const invoice = await createInvoiceFromSalesOrder(so.salesorder_id);
  // const payment = await recordZohoPayment({
  //   invoiceId: invoice.invoice_id,
  //   amount   : invoice.total,
  //   paymentId: order.paymentDetails.trackingId,
  // });

  /* ------------------- Persist IDs & statuses ------------------------ */
  order.zohoSalesOrderId = so.salesorder_id;
  // order.zohoInvoiceId    = invoice.invoice_id;
  // order.zohoPaymentId    = payment.payment_id;
  order.paymentDetails.payment_status = 'paid';
  order.order_status = 'ordered';
  await order.save();

  /* ---------------------- Release reserved stock --------------------- */
  await productModel.bulkWrite(
    order.productDetails.map(p => ({
      updateOne: {
        filter: { _id: p.productId },
        update: { $inc: { reservedStock: -p.quantity } },
      },
    })),
  );
};
