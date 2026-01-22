// const axios = require("axios");
// const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
// const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service");

// const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

// async function zohoRequest(config) {
//   try {
//     return await axios(config);
//   } catch (err) {
//     if (err.response?.status === 401) {
//       const newToken = await refreshZohoAccessToken();
//       setAccessToken(newToken);
//       config.headers = {
//         ...getZohoHeaders(),
//         "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID
//       };
//       return await axios(config);
//     }
//     throw err;
//   }
// }

// exports.createZohoSalesOrder = async ({ user, order, products }) => {
//   const payload = {
//     customer_id: user.zohoCustomerId,
//     reference_number: order.orderId,
//     date: new Date().toISOString().split("T")[0],

//     line_items: products.map(p => ({
//       item_id: p.zohoItemId,
//       variant_id: p.zohoVariantId,
//       quantity: p.quantity,
//       rate: p.sellingPrice
//     })),

//     billing_address: { address: order.billing_address },
//     shipping_address: { address: order.shipping_address },

//     notes: `Website Order: ${order.orderId}`
//   };

//   const res = await zohoRequest({
//     method: "POST",
//     url: `${ZOHO_BASE}/salesorders`,
//     headers: {
//       ...getZohoHeaders(),
//       "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID
//     },
//     data: payload
//   });

//   return res.data.salesorder;
// };

// const axios = require("axios");
// const { getZohoHeaders } = require("../config/zohoAuth");

// exports.createZohoSalesOrder = async ({ user, order, products }) => {
//   if (!user?.zohoCustomerId) {
//     throw new Error("Zoho customer_id missing");
//   }

//   const payload = {
//     customer_id: user.zohoCustomerId,
//     reference_number: order.orderId,
//     date: new Date().toISOString().split("T")[0],

//     line_items: products.map(p => ({
//       item_id: p.zohoVariantId, // ✅ variant item_id
//       quantity: p.quantity,
//       rate: p.sellingPrice
//     }))
//   };

//   try {
//     const headers = await getZohoHeaders();

//     const res = await axios.post(
//       "https://www.zohoapis.in/inventory/v1/salesorders",
//       payload,
//       { headers }
//     );

//     return res.data.salesorder;

//   } catch (err) {
//     console.error("🔥 ZOHO SALES ORDER ERROR:");
//     console.error(JSON.stringify(err.response?.data, null, 2));
//     throw err;
//   }
// };

// exports.confirmZohoSalesOrder = async (salesOrderId) => {
//   const headers = await getZohoHeaders();

//   await axios.post(
//     `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}/status/confirmed`,
//     {},
//     { headers }
//   );
// };
// exports.getZohoSalesOrder = async (salesOrderId) => {
//   const headers = await getZohoHeaders();

//   const res = await axios.get(
//     `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}`,
//     { headers }
//   );

//   return res.data.salesorder;
// };

// exports.createZohoPackage = async ({ salesOrderId }) => {
//   const headers = await getZohoHeaders();

//   // 1️⃣ Fetch sales order FULL details
//   const soRes = await axios.get(
//     `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}`,
//     { headers }
//   );

//   const salesOrder = soRes.data.salesorder;

//   // 2️⃣ Build package line items (IMPORTANT)
//   const line_items = salesOrder.line_items.map(li => ({
//     salesorder_line_item_id: li.line_item_id,
//     quantity: li.quantity
//   }));

//   const payload = {
//     salesorder_id: salesOrderId,
//     date: new Date().toISOString().split("T")[0],
//     line_items
//   };

//   // 3️⃣ Create package
//   const pkgRes = await axios.post(
//     "https://www.zohoapis.in/inventory/v1/packages",
//     payload,
//     { headers }
//   );

//   return pkgRes.data.package;
// };



// exports.createInvoiceFromSalesOrder = async (salesOrderId) => {
//   const headers = await getZohoHeaders();

//   const res = await axios.post(
//     `https://www.zohoapis.in/inventory/v1/invoices/fromsalesorder/${salesOrderId}`,
//     {},
//     { headers }
//   );

//   return res.data.invoice;
// };

// exports.recordZohoPayment = async ({ invoiceId, amount, paymentId }) => {
//   const headers = await getZohoHeaders();

//   const payload = {
//     amount,
//     payment_mode: "Razorpay",
//     reference_number: paymentId,
//     date: new Date().toISOString().split("T")[0],
//     invoice_payments: [
//       {
//         invoice_id: invoiceId,
//         amount_applied: amount
//       }
//     ]
//   };

//   await axios.post(
//     "https://www.zohoapis.in/inventory/v1/customerpayments",
//     payload,
//     { headers }
//   );
// };


// const axios = require("axios");
// const { getZohoHeaders } = require("../config/zohoAuth");

// // 1️⃣ Create Sales Order
// exports.createZohoSalesOrder = async ({ user, order, products }) => {
//   const headers = await getZohoHeaders();

//   const payload = {
//     customer_id: user.zohoCustomerId,
//     reference_number: order.orderId,
//     date: new Date().toISOString().split("T")[0],
//     line_items: products.map(p => ({
//       item_id: p.zohoVariantId,
//       quantity: p.quantity,
//       rate: p.sellingPrice
//     }))
//   };

//   const res = await axios.post(
//     "https://www.zohoapis.in/inventory/v1/salesorders",
//     payload,
//     { headers }
//   );

//   return res.data.salesorder;
// };

// // 2️⃣ Confirm Sales Order
// exports.confirmZohoSalesOrder = async (salesOrderId) => {
//   const headers = await getZohoHeaders();

//   await axios.post(
//     `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}/status/confirmed`,
//     {},
//     { headers }
//   );
// };

// // 3️⃣ Create Invoice
// exports.createInvoiceFromSalesOrder = async (salesOrderId) => {
//   const headers = await getZohoHeaders();

//   const res = await axios.post(
//     `https://www.zohoapis.in/inventory/v1/invoices/fromsalesorder/${salesOrderId}`,
//     {},
//     { headers }
//   );

//   return res.data.invoice;
// };

// // 4️⃣ Record Payment
// exports.recordZohoPayment = async ({ invoiceId, amount, paymentId }) => {
//   const headers = await getZohoHeaders();

//   const payload = {
//     amount,
//     payment_mode: "Razorpay",
//     reference_number: paymentId,
//     date: new Date().toISOString().split("T")[0],
//     invoices: [
//       {
//         invoice_id: invoiceId,
//         amount_applied: amount
//       }
//     ]
//   };

//   const res = await axios.post(
//     "https://www.zohoapis.in/inventory/v1/customerpayments",
//     payload,
//     { headers }
//   );

//   return res.data.payment;
// };

const axios = require('axios');
const { getZohoHeaders } = require('../config/zohoAuth');

/**
 * Helper – show Zoho errors in the console but keep the
 * stack trace for the caller.
 */
async function safeZohoCall(fn, label) {
  try {
    return await fn();
  } catch (err) {
    console.error(`❌ Zoho error at ${label}:`,
                  err.response?.data || err.message);
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* 1️⃣  CREATE SALES-ORDER                                             */
/* ------------------------------------------------------------------ */
exports.createZohoSalesOrder = async ({ user, order, products }) =>
  safeZohoCall(async () => {
    const headers = await getZohoHeaders();

    const payload = {
      customer_id: user.zohoCustomerId,
      reference_number: order.orderId,
      date: new Date().toISOString().split('T')[0],
      line_items: products.map(p => ({
        item_id : p.zohoVariantId,
        quantity: p.quantity,
        rate    : p.sellingPrice,
      })),
    };

    const res = await axios.post(
      'https://www.zohoapis.in/inventory/v1/salesorders',
      payload,
      { headers },
    );

    return res.data.salesorder;
  }, 'create-salesorder');

/* ------------------------------------------------------------------ */
/* 2️⃣  CONFIRM SALES-ORDER                                            */
/* ------------------------------------------------------------------ */
exports.confirmZohoSalesOrder = async salesOrderId =>
  safeZohoCall(async () => {
    const headers = await getZohoHeaders();

    await axios.post(
      `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}/status/confirmed`,
      {},
      { headers },
    );
  }, 'confirm-salesorder');

// 5️⃣ Create Zoho Package (your new function)
exports.createZohoPackage = async (salesOrder) => {
  const headers = await getZohoHeaders();

  // 🔥 IMPORTANT: ensure correct ID
  const salesorderId =
    salesOrder.salesorder_id || salesOrder.salesorderid;

  if (!salesorderId) {
    throw new Error('Sales Order ID missing in Inventory response');
  }

  const payload = {
    salesorder_id: salesorderId,
    date: new Date().toISOString().split('T')[0],
    line_items: salesOrder.line_items.map(item => ({
      salesorder_item_id: item.line_item_id,
      quantity: item.quantity,
    })),
  };

  console.log('📦 Creating package →', payload);

  const res = await axios.post(
    'https://www.zohoapis.in/inventory/v1/packages', // ❌ NO org_id here
    payload,
    { headers }
  );

  return res.data.package;
};







exports.getZohoSalesOrder = async (salesOrderId) => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}`,
    { headers }
  );

  return res.data.salesorder;
};

exports.createShipmentFromSalesOrder = async (salesOrder) => {
  const headers = await getZohoHeaders();
  const orgId = process.env.ZOHO_ORG_ID;

  const payload = {
    salesorder_id: salesOrder.salesorder_id,
    date: new Date().toISOString().split('T')[0],
    line_items: salesOrder.line_items.map(item => ({
      salesorder_item_id: item.line_item_id,
      quantity: item.quantity
    }))
  };

  console.log('🚚 Creating shipment payload →', payload);

  const res = await axios.post(
    `https://www.zohoapis.in/inventory/v1/shipmentorders?organization_id=${orgId}`,
    payload,
    { headers }
  );

  return res.data.shipmentorder;
};



exports.createShipmentFromPackage = async (packageId) => {
  const headers = await getZohoHeaders();

  const res = await axios.post(
    'https://www.zohoapis.in/inventory/v1/shipmentorders',
    { package_ids: [packageId] },
    { headers }
  );

  return res.data.shipmentorder;
};



exports.createInvoiceFromShipmentOrder = async (shipmentOrderId) => {
  const headers = await getZohoHeaders();

  const res = await axios.post(
    'https://www.zohoapis.in/inventory/v1/invoices/fromshipmentorder',
    { shipmentorder_id: shipmentOrderId },
    { headers }
  );

  return res.data.invoice;
};


exports.createInvoiceFromSalesOrder = async (salesOrderId) => {
  const headers = await getZohoHeaders();
  const orgId = process.env.ZOHO_ORG_ID;

  const res = await axios.post(
    `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}/invoices?organization_id=${orgId}`,
    {}, // 👈 EMPTY BODY (IMPORTANT)
    { headers }
  );

  return res.data.invoice;
};







/* ------------------------------------------------------------------ */
/* 4️⃣  RECORD CUSTOMER PAYMENT                                        */
/* ------------------------------------------------------------------ */
exports.recordZohoPayment = async ({ invoiceId, amount, paymentId }) =>
  safeZohoCall(async () => {
    const headers = await getZohoHeaders();

    const payload = {
      amount,
      payment_mode     : 'Razorpay',
      reference_number : paymentId,
      date             : new Date().toISOString().split('T')[0],
      invoices: [
        {
          invoice_id    : invoiceId,
          amount_applied: amount,
        },
      ],
    };

    const res = await axios.post(
      'https://www.zohoapis.in/inventory/v1/customerpayments',
      payload,
      { headers },
    );

    return res.data.payment;
  }, 'record-payment');
