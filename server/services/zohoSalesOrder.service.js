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
const { zohoRequest} = require('./zohoRequest');
const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";
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
// exports.createZohoSalesOrder = async ({ user, order, products }) =>
//   safeZohoCall(async () => {
//     const headers = await getZohoHeaders();

//     const payload = {
//       customer_id: user.zohoCustomerId,
//       reference_number: order.orderId,
//       date: new Date().toISOString().split('T')[0],
//       line_items: products.map(p => ({
//         item_id : p.zohoVariantId,
//         quantity: p.quantity,
//         rate    : p.sellingPrice,
//       })),
//     };

//     const res = await axios.post(
//       'https://www.zohoapis.in/inventory/v1/salesorders',
//       payload,
//       { headers },
//     );

//     return res.data.salesorder;
//   }, 'create-salesorder');
exports.createZohoSalesOrder = async ({
  customer_id,
  line_items,
  order,
  paymentId,
  salesperson_name,
  reference_number,
  location_id 
}) => {

  const payload = {
    customer_id,
    date: new Date().toISOString().split("T")[0],
    reference_number,// 🔥 MAIN REFERENCE
    notes: paymentId
      ? `Payment via Razorpay | Payment ID: ${paymentId}`
      : "Order created from Website",
    line_items,
     // 🔥 THIS IS THE KEY LINE
    location_id
  };

  if (salesperson_name) {
    payload.salesperson_name = salesperson_name;
  }

  // ✅ Optional but recommended
  // payload.custom_fields = [
  //   {
  //     label: "Website Order ID",
  //     value: order.orderId
  //   },
  //   {
  //     label: "Payment ID",
  //     value: payment.id
  //   },
  //   {
  //     label: "Customer Email",
  //     value: order.billing_email
  //   }
  // ];

  console.log(
    "📦 FINAL ZOHO SO PAYLOAD (WITH REFERENCES):",
    JSON.stringify(payload, null, 2)
  );

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/salesorders`,
    data: payload
  });

  return res.data.salesorder;
};


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
// 5️⃣ Create Zoho Package (UPDATED VERSION)
exports.createZohoPackage = async (salesOrder) => {
  const headers = await getZohoHeaders();

  // 1. Get correct sales order ID
  const salesorderId = salesOrder.salesorder_id || salesOrder.salesorderid;
  
  if (!salesorderId) {
    throw new Error('Sales Order ID missing in Inventory response');
  }

  console.log('📦 Creating package for Sales Order:', salesorderId);

  // 2. First verify sales order exists
  try {
    const verifyRes = await axios.get(
      `https://www.zohoapis.in/inventory/v1/salesorders/${salesorderId}`,
      { headers }
    );
    
    const salesOrderData = verifyRes.data.salesorder;
    console.log('✅ Sales Order verified:', {
      id: salesOrderData.salesorder_id,
      number: salesOrderData.salesorder_number,
      status: salesOrderData.status,
      is_packaged: salesOrderData.is_packaged
    });

    // 3. Check if already packaged
    if (salesOrderData.is_packaged) {
      console.log('ℹ️ Sales order is already packaged');
      return { message: 'Already packaged', salesorderId };
    }

    // 4. Create package
    const payload = {
      salesorder_id: salesorderId,
      date: new Date().toISOString().split('T')[0],
      line_items: salesOrderData.line_items.map(item => ({
        salesorder_item_id: item.line_item_id,
        quantity: item.quantity_invoiced || item.quantity,
      })),
    };

    console.log('📦 Package payload:', payload);

    const res = await axios.post(
      'https://www.zohoapis.in/inventory/v1/packages',
      payload,
      { headers }
    );

    console.log('✅ Package created:', res.data.package.package_id);
    return res.data.package;

  } catch (err) {
    console.error('❌ Package creation failed:', {
      status: err.response?.status,
      error: err.response?.data || err.message,
      salesorderId
    });
    
    // If sales order doesn't exist, try to find it by number
    if (err.response?.data?.code === 1002) {
      console.log('🔍 Searching for sales order by reference number...');
      await searchSalesOrderByReference(salesOrder.reference_number || salesOrder.orderId);
    }
    
    throw err;
  }
};

// Search sales order by reference number
async function searchSalesOrderByReference(referenceNumber) {
  const headers = await getZohoHeaders();
  
  try {
    const res = await axios.get(
      `https://www.zohoapis.in/inventory/v1/salesorders?reference_number=${referenceNumber}`,
      { headers }
    );
    
    if (res.data.salesorders && res.data.salesorders.length > 0) {
      console.log('🔍 Found sales orders:', res.data.salesorders.map(so => ({
        id: so.salesorder_id,
        number: so.salesorder_number,
        reference: so.reference_number,
        status: so.status
      })));
      return res.data.salesorders;
    } else {
      console.log('🔍 No sales orders found with reference:', referenceNumber);
      return [];
    }
  } catch (err) {
    console.error('Search error:', err.response?.data || err.message);
    return [];
  }
}

exports.verifySalesOrder = async (salesOrderId) => {
  const headers = await getZohoHeaders();
  
  try {
    const res = await axios.get(
      `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}`,
      { headers }
    );
    
    console.log('✅ Sales Order exists:', {
      id: res.data.salesorder.salesorder_id,
      number: res.data.salesorder.salesorder_number,
      status: res.data.salesorder.status,
      is_packaged: res.data.salesorder.is_packaged
    });
    
    return res.data.salesorder;
    
  } catch (err) {
    console.error('❌ Sales Order verification failed:', {
      salesOrderId,
      error: err.response?.data?.message || err.message
    });
    return null;
  }
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
    { shipmentorder_id: shipmentOrderId,
      "salesorder_number": "SO-00031"
     },

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

  // Simplified invoice creation
exports.createInvoiceFromSalesOrderSimple = async (salesOrderId) => {
  const headers = await getZohoHeaders();
  
  const url = `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}/invoices`;
  
  const payload = {
    ignore_auto_number_generation: false,
    send_email_to_contact: false
  };

  const res = await axios.post(url, payload, { headers });
  return res.data.invoice;
};

// Check Zoho plan features
exports.checkZohoFeatures = async () => {
  const headers = await getZohoHeaders();
  
  try {
    // Try packages endpoint
    const pkgRes = await axios.get('https://www.zohoapis.in/inventory/v1/packages', { headers });
    console.log('✅ Packages feature available');
  } catch (err) {
    console.log('❌ Packages not available (404 or permission error)');
  }
  
  try {
    // Try shipmentorders endpoint
    const shipRes = await axios.get('https://www.zohoapis.in/inventory/v1/shipmentorders', { headers });
    console.log('✅ Shipments feature available');
  } catch (err) {
    console.log('❌ Shipments not available');
  }
};

exports.voidZohoSalesOrder = async (salesOrderId) => {
  const headers = await getZohoHeaders();

  console.log("🛑 VOIDING Zoho Sales Order:", salesOrderId);

  const res = await axios.post(
    `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}/status/void`,
    {}, // ✅ EMPTY BODY (IMPORTANT)
    { headers }
  );

  return res.data;
};

// services/zohoOrder.service.js
// getZohoSalesOrder (UPDATED)
exports.getZohoSalesOrder = async (salesOrderId) => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}?organization_id=60013451386`,
    { headers }
  );

  const so = res.data.salesorder;

  if (!so) {
    throw new Error("Zoho salesorder not found");
  }

  return {
    salesorder_id: so.salesorder_id,
    location_id: so.location_id || null,
    line_items: so.line_items.map(li => ({
      item_id: li.item_id,
      salesorder_item_id: li.line_item_id, // 🔥 THIS FIXES YOUR ERROR
      quantity: li.quantity
    }))
  };
};

exports.getItemLocationId = async (itemId) => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    `https://www.zohoapis.in/inventory/v1/items/${itemId}`,
    { headers }
  );

  return res.data.item.location_id;
};


