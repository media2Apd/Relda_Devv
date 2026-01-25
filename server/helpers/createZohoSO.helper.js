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

// const productModel = require('../models/productModel');
// const {
//   createZohoSalesOrder,
//   confirmZohoSalesOrder,
//   createInvoiceFromSalesOrder,
//   recordZohoPayment,
// } = require('../services/zohoSalesOrder.service');

// /**
//  * 1.  Create Sales-Order in Zoho
//  * 2.  Confirm it
//  * 3.  Create Invoice
//  * 4.  Mark it paid
//  * 5.  Persist Zoho IDs in our Order document
//  * 6.  Release reserved stock
//  */
// module.exports = async function createSalesOrderAndReleaseStock(order, user) {
//   /* ------------------------ Prepare line-items ------------------------ */
//   const products = await Promise.all(
//     order.productDetails.map(async p => {
//       const prod = await productModel.findById(p.productId);
//       return {
//         zohoVariantId: prod.zohoVariantId,
//         quantity     : p.quantity,
//         sellingPrice : p.sellingPrice,
//       };
//     }),
//   );

//   /* -------------------------- Zoho calls ----------------------------- */
//   const so      = await createZohoSalesOrder({ user, order, products });
//   await confirmZohoSalesOrder(so.salesorder_id);
//   // const invoice = await createInvoiceFromSalesOrder(so.salesorder_id);
//   // const payment = await recordZohoPayment({
//   //   invoiceId: invoice.invoice_id,
//   //   amount   : invoice.total,
//   //   paymentId: order.paymentDetails.trackingId,
//   // });

//   /* ------------------- Persist IDs & statuses ------------------------ */
//   order.zohoSalesOrderId = so.salesorder_id;
//   // order.zohoInvoiceId    = invoice.invoice_id;
//   // order.zohoPaymentId    = payment.payment_id;
//   order.paymentDetails.payment_status = 'paid';
//   order.order_status = 'ordered';
//   await order.save();

//   /* ---------------------- Release reserved stock --------------------- */
//   await productModel.bulkWrite(
//     order.productDetails.map(p => ({
//       updateOne: {
//         filter: { _id: p.productId },
//         update: { $inc: { reservedStock: -p.quantity } },
//       },
//     })),
//   );
// };

const productModel = require("../models/productModel");
const { ensureZohoCustomerForOrder } = require("../helpers/ensureZohoCustomer");
const {
  createZohoSalesOrder,
  confirmZohoSalesOrder
} = require("../services/zohoSalesOrder.service");
const { createZohoCustomer } = require("../services/zohoCustomer.service");
const {
  getLocationIdByName
} = require("../services/zohoLocationService");

/**
 * Handles BOTH:
 * - Admin MANAGESALES orders
 * - Direct customer checkout
 */
// module.exports = async function createSalesOrderAndReleaseStock(
//   order,
//   customerUser,   // 🔥 actual customer (checkout user)
//   reqUser         // 🔥 staff / admin user (optional)
// ) {

//   /* ================= ENSURE ZOHO CUSTOMER ================= */
//   const zohoCustomerId = await ensureZohoCustomer(customerUser);

//   /* ================= PREPARE LINE ITEMS ================= */
//   const products = await Promise.all(
//     order.productDetails.map(async p => {
//       const prod = await productModel.findById(p.productId);

//       return {
//         item_id: prod.zohoVariantId,
//         quantity: p.quantity,
//         rate: p.sellingPrice
//       };
//     })
//   );

//   /* ================= CREATE SALES ORDER ================= */
//   const so = await createZohoSalesOrder({
//     order,
//     customer_id: zohoCustomerId,
//     products,
//     sales_person: reqUser?.role === "MANAGESALES"
//       ? reqUser.name
//       : "Online Store"
//   });

//   await confirmZohoSalesOrder(so.salesorder_id);

//   /* ================= SAVE ZOHO DATA ================= */
//   order.zohoSalesOrderId = so.salesorder_id;
//   order.order_status = "ordered";
//   order.paymentDetails.payment_status = "paid";

//   await order.save();

//   /* ================= RELEASE RESERVED STOCK ================= */
//   await productModel.bulkWrite(
//     order.productDetails.map(p => ({
//       updateOne: {
//         filter: { _id: p.productId },
//         update: { $inc: { reservedStock: -p.quantity } }
//       }
//     }))
//   );

//   console.log("✅ Sales Order flow completed for:", order.orderId);
// };

// module.exports = async function createSalesOrderAndReleaseStock(
//   order,
//   customerUser,
//   reqUser
// ) {

//   /* ================= ENSURE ZOHO CUSTOMER ================= */
//   const zohoCustomerId = await ensureZohoCustomerForOrder({
//     order,
//     customerUser,
//     reqUser
//   });

//   /* ================= PREPARE LINE ITEMS ================= */
//   const products = await Promise.all(
//     order.productDetails.map(async p => {
//       const prod = await productModel.findById(p.productId);

//       if (!prod?.zohoVariantId) {
//         throw new Error(`Zoho item missing for product ${p.productId}`);
//       }

//       return {
//         item_id: prod.zohoVariantId,
//         quantity: p.quantity,
//         rate: p.sellingPrice
//       };
//     })
//   );

//   /* ================= CLEAN ZOHO PAYLOAD ================= */
//   // const payload = {
//   //   customer_id: zohoCustomerId,
//   //   date: new Date().toISOString().split("T")[0],
//   //   reference_number: order.orderId, // 🔥 website order reference
//   //    paymentId: order.paymentDetails.paymentId, // ✅ SAFE
//   //   notes: "Order created from Website",
//   //   line_items: products
//   // };

//   // // add salesperson ONLY if MANAGESALES
//   // if (reqUser?.role === "MANAGESALES" && reqUser?.name) {
//   //   payload.salesperson_name = reqUser.name;
//   // }
//   const payload = {
//   customer_id: zohoCustomerId,
//   date: new Date().toISOString().split("T")[0],

//   // 🔥 CUSTOMER TRACE
//   reference_number: order.orderId,
//   notes: `Customer: ${order.billing_name} | ${order.billing_email}`,

//   line_items: products
// };

// // 🔥 Salesperson only if MANAGESALES
// if (reqUser?.role === "MANAGESALES") {
//   payload.salesperson_name = reqUser.name;
// }


//   console.log(
//     "📦 FINAL ZOHO SALES ORDER PAYLOAD:",
//     JSON.stringify(payload, null, 2)
//   );

//   /* ================= CREATE & CONFIRM ================= */
//   const so = await createZohoSalesOrder(payload);
//   await confirmZohoSalesOrder(so.salesorder_id);

//   /* ================= SAVE TO DB ================= */
//   order.zohoSalesOrderId = so.salesorder_id;
//   order.order_status = "ordered";
//   order.paymentDetails.payment_status = "success";
//   await order.save();

//   console.log("✅ Zoho Sales Order Created:", so.salesorder_id);
// };
// module.exports = async function createSalesOrderAndReleaseStock(
//   order,
//   customerUser, // ignore for MANAGESALES
//   reqUser
// ) {

//   let zohoCustomerId;

//   /* ================= MANAGESALES → OLD FLOW ================= */
//   if (reqUser?.role === "MANAGESALES") {

//     console.log("🔥 MANAGESALES ORDER – CREATE CUSTOMER FROM BILLING");

//     // 🔥 ALWAYS create customer from billing details
//     const zohoCustomer = await createZohoCustomer({
//       name: order.billing_name,
//       email: order.billing_email,
//       mobile: order.billing_tel,
//       address: parseAddress(order.billing_address)
//     });

//     zohoCustomerId = zohoCustomer.contact_id;

//     console.log("🆕 Zoho customer created for order:", zohoCustomerId);
//   }

//   /* ================= NORMAL CUSTOMER FLOW (UNCHANGED) ================= */
//   else {
//     zohoCustomerId = await ensureZohoCustomerForOrder(order);
//   }

//   /* ================= PREPARE LINE ITEMS ================= */
//   const products = await Promise.all(
//     order.productDetails.map(async p => {
//       const prod = await productModel.findById(p.productId);

//       if (!prod?.zohoVariantId) {
//         throw new Error(`Zoho item missing for product ${p.productId}`);
//       }

//       return {
//         item_id: prod.zohoVariantId,
//         quantity: p.quantity,
//         rate: p.sellingPrice
//       };
//     })
//   );

//   /* ================= ZOHO PAYLOAD (OLD STYLE) ================= */
//   const payload = {
//     customer_id: zohoCustomerId,
//     date: new Date().toISOString().split("T")[0],
//     reference_number: order.orderId,
//     notes: "Order created from Website",
//     line_items: products
//   };

//   // 🔥 Sales person name ONLY for MANAGESALES
//   if (reqUser?.role === "MANAGESALES") {
//     payload.salesperson_name = reqUser.name;
//   }

//   console.log("📦 FINAL ZOHO SALES ORDER PAYLOAD:", payload);

//   /* ================= CREATE & CONFIRM ================= */
//   const so = await createZohoSalesOrder(payload);
//   await confirmZohoSalesOrder(so.salesorder_id);

//   /* ================= SAVE ================= */
//   order.zohoSalesOrderId = so.salesorder_id;
//   order.order_status = "ordered";
//   order.paymentDetails.payment_status = "success";
//   await order.save();

//   console.log("✅ Zoho Sales Order Created:", so.salesorder_id);
// };

// function parseAddress(addressString = "") {
//   const parts = addressString.split(",").map(p => p.trim());

//   return {
//     street: parts[0] || "",
//     city: parts[2] || parts[1] || "",
//     state: parts[3] || "",
//     pinCode: parts[4] || "",
//     country: parts[5] || "India"
//   };
// }

// module.exports = async function createSalesOrderAndReleaseStock(
//   order,
//   customerUser, // logged-in user (GENERAL) or null
//   reqUser       // MANAGESALES or undefined
// ) {

//   console.log(order, customerUser, reqUser);
  

//   let zohoCustomerId;

//   /* ================= CASE 1: MANAGESALES ================= */
//   if (reqUser?.role === "MANAGESALES") {

//     console.log("🔥 MANAGESALES – CREATE CUSTOMER FROM BILLING");

//     const zohoCustomer = await createZohoCustomer({
//       name: order.billing_name,
//       email: order.billing_email,
//       mobile: order.billing_tel,
//       address: parseAddress(order.billing_address)
//     });

//     zohoCustomerId = zohoCustomer.contact_id;
//   }

//   /* ================= CASE 2: GENERAL USER ================= */
//   else if (customerUser?.role === "GENERAL") {

//     if (customerUser.zohoCustomerId) {
//       console.log(
//         "✅ GENERAL USER – USING EXISTING ZOHO CUSTOMER:",
//         customerUser.zohoCustomerId
//       );

//       zohoCustomerId = customerUser.zohoCustomerId;
//     } else {
//       console.log("🆕 GENERAL USER – CREATING ZOHO CUSTOMER FROM BILLING");

//       const zohoCustomer = await createZohoCustomer({
//         name: order.billing_name,
//         email: order.billing_email,
//         mobile: order.billing_tel,
//         address: parseAddress(order.billing_address)
//       });

//       zohoCustomerId = zohoCustomer.contact_id;

//       // save to user
//       customerUser.zohoCustomerId = zohoCustomerId;
//       await customerUser.save();
//     }
//   }

//   /* ================= CASE 3: FALLBACK (PAYMENT / WEBHOOK) ================= */
//   if (!zohoCustomerId) {

//     console.log("⚠️ FALLBACK – NO USER / NO ROLE → CREATE FROM BILLING");

//     const zohoCustomer = await createZohoCustomer({
//       name: order.billing_name,
//       email: order.billing_email,
//       mobile: order.billing_tel,
//       address: parseAddress(order.billing_address)
//     });

//     zohoCustomerId = zohoCustomer.contact_id;

//     // optional: keep mapping in order
//     order.zohoCustomerId = zohoCustomerId;
//     await order.save();
//   }

//   /* ================= FINAL SAFETY ================= */
//   if (!zohoCustomerId) {
//     throw new Error("Zoho customer ID not resolved");
//   }

//   /* ================= PREPARE LINE ITEMS ================= */
//   const products = await Promise.all(
//     order.productDetails.map(async p => {
//       const prod = await productModel.findById(p.productId);

//       if (!prod?.zohoVariantId) {
//         throw new Error(`Zoho item missing for product ${p.productId}`);
//       }

//       return {
//         item_id: prod.zohoVariantId,
//         quantity: p.quantity,
//         rate: p.sellingPrice
//       };
//     })
//   );

//   /* ================= ZOHO PAYLOAD ================= */
//   const payload = {
//     customer_id: zohoCustomerId,
//     date: new Date().toISOString().split("T")[0],
//     reference_number: order.orderId,
//     notes: "Order created from Website",
//     line_items: products,
//     location_id: ZOHO_LOCATIONS.RELDA
//   };

//   if (reqUser?.role === "MANAGESALES") {
//     payload.salesperson_name = reqUser.name;
//   }

//   console.log("📦 FINAL ZOHO SALES ORDER PAYLOAD:", payload);

//   /* ================= CREATE & CONFIRM ================= */
//   const so = await createZohoSalesOrder(payload);
//   await confirmZohoSalesOrder(so.salesorder_id);

//   /* ================= SAVE ================= */
//   order.zohoSalesOrderId = so.salesorder_id;
//   order.order_status = "ordered";
//   order.paymentDetails.payment_status = "success";
//   await order.save();

//   console.log("✅ Zoho Sales Order Created:", so.salesorder_id);
// };
function parseAddress(addressString = "") {
  const parts = addressString.split(",").map(p => p.trim());

  return {
    address: parts.slice(0, 2).join(", "),
    city: parts[2] || "",
    state: parts[3] || "",
    zip: parts[4] || "",
    country: parts[5] || "India"
  };
}

module.exports = async function createSalesOrderAndReleaseStock(
  order,
  customerUser,
  reqUser
) {
  let zohoCustomerId;

  /* =============== CUSTOMER CREATE / GET =============== */
  if (reqUser?.role === "MANAGESALES") {
    const zohoCustomer = await createZohoCustomer({
      name: order.billing_name,
      email: order.billing_email,
      mobile: order.billing_tel,
      address: parseAddress(order.billing_address)
    });
    zohoCustomerId = zohoCustomer.contact_id;
  } else if (customerUser?.role === "GENERAL") {
    if (customerUser.zohoCustomerId) {
      zohoCustomerId = customerUser.zohoCustomerId;
    } else {
      const zohoCustomer = await createZohoCustomer({
        name: order.billing_name,
        email: order.billing_email,
        mobile: order.billing_tel,
        address: parseAddress(order.billing_address)
      });
      zohoCustomerId = zohoCustomer.contact_id;
      customerUser.zohoCustomerId = zohoCustomerId;
      await customerUser.save();
    }
  }

  if (!zohoCustomerId) {
    const zohoCustomer = await createZohoCustomer({
      name: order.billing_name,
      email: order.billing_email,
      mobile: order.billing_tel,
      address: parseAddress(order.billing_address)
    });
    zohoCustomerId = zohoCustomer.contact_id;
    order.zohoCustomerId = zohoCustomerId;
    await order.save();
  }

  if (!zohoCustomerId) {
    throw new Error("Zoho customer ID not resolved");
  }

  /* =============== LINE ITEMS =============== */
  const line_items = await Promise.all(
    order.productDetails.map(async p => {
      const prod = await productModel.findById(p.productId);
      if (!prod?.zohoVariantId) {
        throw new Error(`Zoho item missing for product ${p.productId}`);
      }

      return {
        item_id: prod.zohoVariantId,
        quantity: p.quantity,
        rate: p.basePrice
      };
    })
  );

  /* =============== LOCATION =============== */

  // fetch location_id by name
  const relDaLocationId = await getLocationIdByName("RELDA");

  if (!relDaLocationId) {
    throw new Error("RELDA location_id not found in Zoho");
  }

  /* =============== BUILD PAYLOAD =============== */
  const payload = {
    customer_id: zohoCustomerId,
    date: new Date().toISOString().split("T")[0],
    reference_number: order.orderId,
    notes: "Order created from Website",
    line_items,
    location_id: relDaLocationId
  };

  if (reqUser?.role === "MANAGESALES") {
    payload.salesperson_name = reqUser.name;
  }

  console.log("📦 FINAL ZOHO SALES ORDER PAYLOAD:", payload);

  /* =============== EXECUTE =============== */
  const so = await createZohoSalesOrder(payload);
  await confirmZohoSalesOrder(so.salesorder_id);

  /* =============== SAVE =============== */
  order.zohoSalesOrderId = so.salesorder_id;
  order.order_status = "ordered";
  order.paymentDetails.payment_status = "success";
  await order.save();

  console.log("✅ Zoho Sales Order Created:", so.salesorder_id);
};