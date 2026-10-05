// const axios = require("axios");
// const productModel = require("../models/productModel");
// const userModel = require("../models/userModel");

// const {
//   createZohoSalesOrder,
//   confirmZohoSalesOrder,
//   getZohoSalesOrder
// } = require("../services/zohoSalesOrder.service");

// const {
//   createZohoCustomer,
//   searchZohoCustomer,
//   updateZohoCustomer,
//   getZohoCustomerById
// } = require("../services/zohoCustomer.service");

// const {
//   getLocationIdByName
// } = require("../services/zohoLocationService");

// const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
// const { refreshZohoAccessToken } = require("../services/zohoTokenRefresh.service");

// const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

// /* ================= ZOHO REQUEST WITH AUTO-REFRESH ================= */
// async function zohoRequest(config) {
//   try {
//     return await axios(config);
//   } catch (err) {
//     if (err.response?.status === 401) {
//       console.log("🔄 Access token expired, refreshing token...");
//       const newToken = await refreshZohoAccessToken();
//       setAccessToken(newToken);
//       config.headers = getZohoHeaders();
//       return await axios(config);
//     }
//     throw err;
//   }
// }

// /* ================= HELPER FUNCTIONS ================= */
// function parseAddress(addressString = "") {
//   const parts = addressString.split(",").map((p) => p.trim());
//   return {
//     address: parts.slice(0, 2).join(", "),
//     city: parts[2] || "",
//     state: parts[3] || "",
//     zip: parts[4] || "",
//     country: parts[5] || "India"
//   };
// }

// function normalizeCustomerName(name, email) {
//   if (name && name.trim().length >= 3) {
//     return name
//       .replace(/[^a-zA-Z\s]/g, "")
//       .replace(/\s+/g, " ")
//       .trim()
//       .replace(/\b\w/g, (c) => c.toUpperCase());
//   }

//   if (email) {
//     return (
//       email
//         .split("@")[0]
//         .replace(/[^a-zA-Z]/g, "")
//         .replace(/\b\w/g, (c) => c.toUpperCase()) + " Customer"
//     );
//   }

//   return "Relda Customer";
// }

// // 👉 Extract Serial Numbers
// function getSerialNumbers(p, order, idx = 0) {
//   const candidates = [
//     p?.serialNumber,
//     p?.productSerialNumber,
//     p?.serial_number,
//     p?.serialNo,
//     p?.serial,
//     order?.serialNumber,
//     order?.productSerialNumber,
//     order?.serial_number,
//     order?.serialNo,
//     order?.serial,
//     order?.productDetails?.[idx]?.serialNumber,
//     order?.productDetails?.[idx]?.productSerialNumber,
//     order?.productDetails?.[idx]?.serial_number,
//     order?.productDetails?.[idx]?.serialNo
//   ];

//   for (const val of candidates) {
//     if (val && typeof val === "string" && val.trim().length > 0) {
//       return val.split(",").map((s) => s.trim()).filter(Boolean);
//     }
//     if (Array.isArray(val) && val.length > 0) {
//       return val.map((s) => String(s).trim()).filter(Boolean);
//     }
//   }

//   if (Array.isArray(p?.serialNumbers) && p.serialNumbers.length > 0) {
//     return p.serialNumbers.map((s) => String(s).trim()).filter(Boolean);
//   }
//   if (Array.isArray(order?.serialNumbers) && order.serialNumbers.length > 0) {
//     if (order.productDetails?.length === 1) {
//       return order.serialNumbers.map((s) => String(s).trim()).filter(Boolean);
//     }
//     if (order.serialNumbers[idx]) {
//       return [String(order.serialNumbers[idx]).trim()];
//     }
//   }

//   return [];
// }

// // 🔥 SMART BASE RATE CALCULATOR (Exact Rupee Match)
// function calculateExactBaseRate(unitPrice, gstPercent = 18, quantity = 1) {
//   const targetTotal = Number(unitPrice) * quantity;
//   const halfGst = (gstPercent / 2) / 100;

//   let bestRate = Number((unitPrice / (1 + gstPercent / 100)).toFixed(2));

//   function computeTotal(r) {
//     const lineSubTotal = Number((r * quantity).toFixed(2));
//     const cgst = Number((lineSubTotal * halfGst).toFixed(2));
//     const sgst = Number((lineSubTotal * halfGst).toFixed(2));
//     return Number((lineSubTotal + cgst + sgst).toFixed(2));
//   }

//   let bestDiff = Math.abs(computeTotal(bestRate) - targetTotal);

//   for (const delta of [0.01, -0.01, 0.02, -0.02]) {
//     const testRate = Number((bestRate + delta).toFixed(2));
//     const testDiff = Math.abs(computeTotal(testRate) - targetTotal);
//     if (testDiff < bestDiff) {
//       bestRate = testRate;
//       bestDiff = testDiff;
//     }
//   }

//   return bestRate;
// }

// /* ================= ZOHO FULFILLMENT INTERNAL API CALLS ================= */

// // 1. Create Package
// async function createZohoPackage({ salesorder_id, line_items }) {
//   const payload = {
//     date: new Date().toISOString().split("T")[0],
//     line_items: line_items.map((item) => ({
//       so_line_item_id: item.so_line_item_id,
//       quantity: item.quantity
//     }))
//   };

//   const res = await zohoRequest({
//     method: "POST",
//     url: `${ZOHO_BASE}/packages?salesorder_id=${salesorder_id}`,
//     data: payload,
//     headers: getZohoHeaders()
//   });

//   return res.data.package;
// }

// // 2. Create Shipment and Mark as Delivered
// async function createZohoShipmentDelivered({ salesorder_id, package_id }) {
//   const payload = {
//     date: new Date().toISOString().split("T")[0],
//     delivery_method: "Hand Delivery",
//     tracking_number: "SALE-IN-HAND"
//   };

//   const res = await zohoRequest({
//     method: "POST",
//     url: `${ZOHO_BASE}/shipmentorders?package_ids=${package_id}&salesorder_id=${salesorder_id}&is_delivered=true`,
//     data: payload,
//     headers: getZohoHeaders()
//   });

//   return res.data.shipmentorder;
// }

// // 3. Create Invoice against the Sales Order
// async function createZohoInvoice({ salesorder_id, customer_id, line_items, adjustment, warehouse_location_id }) {
//   const payload = {
//     customer_id,
//     salesorder_id,
//     date: new Date().toISOString().split("T")[0],
//     line_items: line_items.map((item) => ({
//       salesorder_item_id: item.so_line_item_id,
//       item_id: item.item_id,
//       quantity: item.quantity,
//       rate: item.rate,
//       description: item.description, // 👈 Serial number invoice-la print aagum
//       ...(warehouse_location_id ? { location_id: warehouse_location_id } : {})
//     })),
//     ...(adjustment && Math.abs(adjustment) > 0 ? {
//       adjustment,
//       adjustment_description: "Round Off"
//     } : {})
//   };

//   const res = await zohoRequest({
//     method: "POST",
//     url: `${ZOHO_BASE}/invoices`,
//     data: payload,
//     headers: getZohoHeaders()
//   });

//   return res.data.invoice;
// }

// // 4. Record Payment on Invoice
// async function recordZohoPayment({ customer_id, invoice_id, amount, reference_number, payment_mode }) {
//   const payload = {
//     customer_id,
//     payment_mode: payment_mode || "cash",
//     amount,
//     date: new Date().toISOString().split("T")[0],
//     reference_number: reference_number || "HAND-PAYMENT",
//     invoices: [
//       {
//         invoice_id,
//         amount_applied: amount
//       }
//     ]
//   };

//   const res = await zohoRequest({
//     method: "POST",
//     url: `${ZOHO_BASE}/customerpayments`,
//     data: payload,
//     headers: getZohoHeaders()
//   });

//   return res.data.payment;
// }

// /* ================= MAIN EXPORTED FUNCTION ================= */
// module.exports = async function createSalesOrderAndReleaseStock(
//   order,
//   customerUser,
//   reqUser
// ) {
//   try {
//     let zohoCustomerId = null;

//     const isManageSales =
//       customerUser?.role === "MANAGESALES" || reqUser?.role === "MANAGESALES";

//     const effectiveUser = isManageSales
//       ? (customerUser?.role === "MANAGESALES" ? customerUser : reqUser)
//       : (reqUser || customerUser);

//     console.log(`👤 Order Processed By: ${effectiveUser?.name || "System"} | Is ManageSales: ${isManageSales}`);

//     console.log("🔍 DEBUG SERIAL DATA IN ORDER:", {
//       order_serialNumber: order?.serialNumber,
//       order_productSerialNumber: order?.productSerialNumber,
//       order_serialNo: order?.serialNo,
//       prod_serialNumber: order?.productDetails?.[0]?.serialNumber,
//       prod_productSerialNumber: order?.productDetails?.[0]?.productSerialNumber
//     });

//     // =========================================================================
//     // 1️⃣ CUSTOMER RESOLUTION
//     // =========================================================================
//     const customerName = normalizeCustomerName(
//       order.billing_name,
//       order.billing_email
//     );

//     const customerData = {
//       name: customerName,
//       email: order.billing_email?.trim()?.toLowerCase(),
//       mobile: order.billing_tel?.trim(),
//       address: parseAddress(order.billing_address),
//       isBusiness: !!order.gstDetails?.gstin,
//       gstin: order.gstDetails?.gstin?.trim(),
//       companyName: order.gstDetails?.companyName || customerName,
//       gst_treatment: order.gstDetails?.gstin ? "business_gst" : "consumer"
//     };

//     if (isManageSales) {
//       console.log(`💼 MANAGESALES: Creating/Searching Zoho Contact for: ${customerData.email}`);

//       const existingCustomer = await searchZohoCustomer({
//         email: customerData.email,
//         gstin: customerData.gstin,
//         name: customerData.name
//       });

//       if (existingCustomer) {
//         zohoCustomerId = existingCustomer.contact_id;
//         console.log(`✅ MANAGESALES: Existing customer linked: ${zohoCustomerId}`);
//         await updateZohoCustomer(zohoCustomerId, customerData);
//       } else {
//         console.log(`🆕 MANAGESALES: New customer created: ${customerName}`);
//         const created = await createZohoCustomer(customerData);
//         zohoCustomerId = created.contact_id;
//       }

//       order.zohoCustomerId = zohoCustomerId;

//     } else {
//       if (customerUser?.zohoCustomerId) {
//         const validContact = await getZohoCustomerById(customerUser.zohoCustomerId);
//         if (validContact) {
//           zohoCustomerId = validContact.contact_id;
//         } else {
//           customerUser.zohoCustomerId = null;
//           await userModel.updateOne(
//             { _id: customerUser._id },
//             { $unset: { zohoCustomerId: 1 } }
//           ).catch(() => {});
//         }
//       }

//       if (!zohoCustomerId) {
//         const existingCustomer = await searchZohoCustomer({
//           email: customerData.email,
//           gstin: customerData.gstin,
//           name: customerData.name
//         });

//         if (existingCustomer) {
//           zohoCustomerId = existingCustomer.contact_id;
//           await updateZohoCustomer(zohoCustomerId, customerData);
//         } else {
//           const created = await createZohoCustomer(customerData);
//           zohoCustomerId = created.contact_id;
//         }

//         if (customerUser?._id && zohoCustomerId) {
//           await userModel.updateOne(
//             { _id: customerUser._id },
//             { $set: { zohoCustomerId } }
//           ).catch(() => {});
//         }
//       }
//     }

//     if (!zohoCustomerId) {
//       throw new Error("Zoho customer ID could not be resolved from billing details");
//     }

//     // =========================================================================
//     // 🏢 2️⃣ LOCATION RESOLUTION
//     // =========================================================================
//     const headOfficeLocationId = await getLocationIdByName("Head Office") || await getLocationIdByName("RELDA");

//     let brandshopLocationId = null;
//     if (isManageSales && effectiveUser?.zohoLocationId) {
//       brandshopLocationId = effectiveUser.zohoLocationId;
//       console.log(`🏬 Brandshop Stock Location Assigned: ${brandshopLocationId}`);
//     }

//     // =========================================================================
//     // 3️⃣ PREPARE SALES ORDER LINE ITEMS
//     // =========================================================================
//     const allCollectedSerials = [];

//     const line_items = await Promise.all(
//       order.productDetails.map(async (p, idx) => {
//         const prod = await productModel.findById(p.productId);
//         if (!prod?.zohoVariantId) {
//           throw new Error(`Zoho item missing for product ${p.productId}`);
//         }

//         const serial_numbers = getSerialNumbers(p, order, idx);
//         allCollectedSerials.push(...serial_numbers);

//         const inclusivePrice = Number(p.sellingPrice || prod.sellingPrice || 0);
//         const gstRate = Number(prod.gstPercent || p.gstPercent || 18);
//         const quantity = Number(p.quantity || 1);

//         const exactBaseRate = calculateExactBaseRate(inclusivePrice, gstRate, quantity);

//         console.log(`💰 Item: ${prod.productName} | Website Paid: ₹${inclusivePrice} | Exact Rate: ₹${exactBaseRate} | Serials: ${JSON.stringify(serial_numbers)}`);

//         return {
//           item_id: prod.zohoVariantId,
//           quantity: p.quantity,
//           rate: exactBaseRate,
//           ...(brandshopLocationId ? { location_id: brandshopLocationId } : {}),
//           // 👉 Description-la serial number print aagum (Error varaadhu!)
//           description: serial_numbers.length > 0 ? `Serial No: ${serial_numbers.join(", ")}` : (prod.productName || "Product")
//         };
//       })
//     );

//     const uniqueSerials = [...new Set(allCollectedSerials)];
//     const serialNotes = uniqueSerials.length > 0 ? ` | Serial: ${uniqueSerials.join(", ")}` : "";

//     // =========================================================================
//     // 4️⃣ TOTAL & ROUND-OFF VERIFICATION
//     // =========================================================================
//     const expectedTotal = Number(
//       order.totalAmount ||
//       order.productDetails.reduce((sum, p) => sum + (Number(p.sellingPrice || 0) * Number(p.quantity || 1)), 0)
//     );

//     const calculatedSubTotal = line_items.reduce((sum, item) => sum + (Number(item.rate) * Number(item.quantity)), 0);
//     const calculatedTaxTotal = line_items.reduce((sum, item) => {
//       const lineAmt = Number(item.rate) * Number(item.quantity);
//       const cgst = Number((lineAmt * 0.09).toFixed(2));
//       const sgst = Number((lineAmt * 0.09).toFixed(2));
//       return sum + cgst + sgst;
//     }, 0);

//     const zohoEstimatedTotal = Number((calculatedSubTotal + calculatedTaxTotal).toFixed(2));
//     const roundOffDiff = Number((expectedTotal - zohoEstimatedTotal).toFixed(2));

//     const payload = {
//       customer_id: zohoCustomerId,
//       date: new Date().toISOString().split("T")[0],
//       reference_number: order.orderId,
//       notes: `${order.saleInHand ? "Hand Sale" : "Order created from Website"}${serialNotes}`,
//       line_items,
//       ...(headOfficeLocationId ? { location_id: headOfficeLocationId } : {}),
//       ...(Math.abs(roundOffDiff) > 0 && Math.abs(roundOffDiff) <= 5 ? {
//         adjustment: roundOffDiff,
//         adjustment_description: "Round Off"
//       } : {})
//     };

//     if (isManageSales) {
//       payload.salesperson_name = effectiveUser?.name || "MANAGESALES";
//     }

//     console.log("📦 FINAL ZOHO SO PAYLOAD:", JSON.stringify(payload, null, 2));

//     // 5️⃣ CREATE & CONFIRM SALES ORDER
//     const so = await createZohoSalesOrder(payload);
//     await confirmZohoSalesOrder(so.salesorder_id);
//     console.log("✅ Zoho Sales Order Created & Confirmed in Location:", brandshopLocationId || headOfficeLocationId);

//     order.zohoSalesOrderId = so.salesorder_id;

//     // =========================================================================
//     // 6️⃣ SALE IN HAND / FULFILLMENT FLOW
//     // =========================================================================
//     if (order.saleInHand === true) {
//       console.log("⚡ Sale in Hand detected for order:", order.orderId);

//       const fullSO = await getZohoSalesOrder(so.salesorder_id);

//       // Zoho SO response line items resolve panrom
//       const soLines = fullSO?.salesorder?.line_items || fullSO?.line_items || [];

//       const fulfillmentItems = soLines.map((li, idx) => {
//         const itemDetail = order.productDetails?.[idx];
//         const serial_numbers = getSerialNumbers(itemDetail, order, idx);
//         const soLineId = li.line_item_id || li.so_line_item_id || li.salesorder_item_id;

//         return {
//           so_line_item_id: soLineId,
//           item_id: li.item_id,
//           quantity: li.quantity,
//           rate: li.rate,
//           description: serial_numbers.length > 0 ? `Serial No: ${serial_numbers.join(", ")}` : (li.description || "Product")
//         };
//       });

//       // A) Create Package (Clean payload - Error varaadhu!)
//       const pkg = await createZohoPackage({
//         salesorder_id: so.salesorder_id,
//         line_items: fulfillmentItems
//       });
//       order.zohoPackageId = pkg.package_id;
//       console.log("📦 Package Created from Brandshop:", pkg.package_id);

//       // B) Create Shipment and Mark as Delivered
//       const shipment = await createZohoShipmentDelivered({
//         salesorder_id: so.salesorder_id,
//         package_id: pkg.package_id
//       });
//       order.zohoShipmentOrderId = shipment.shipmentorder_id;
//       console.log("🚚 Shipment Marked as Delivered from Brandshop:", brandshopLocationId || "Default");

//       // C) Create Invoice against Sales Order
//       const invoice = await createZohoInvoice({
//         salesorder_id: so.salesorder_id,
//         customer_id: zohoCustomerId,
//         line_items: fulfillmentItems,
//         adjustment: Math.abs(roundOffDiff) > 0 && Math.abs(roundOffDiff) <= 5 ? roundOffDiff : 0,
//         warehouse_location_id: brandshopLocationId
//       });
//       order.zohoInvoiceId = invoice.invoice_id;
//       console.log("🧾 Invoice Generated with Serials in Description:", invoice.invoice_id);

//       // D) Record Payment on Invoice
//       const isCash =
//         order.paymentDetails?.payment_method_type === "CASH" ||
//         order.paymentDetails?.payment_status === "cash_on_hand";
//       const paymentModeForZoho = isCash ? "cash" : "online";

//       const payment = await recordZohoPayment({
//         customer_id: zohoCustomerId,
//         invoice_id: invoice.invoice_id,
//         amount: invoice.total || expectedTotal,
//         reference_number: order.orderId,
//         payment_mode: paymentModeForZoho
//       });
//       order.zohoPaymentId = payment.payment_id;
//       console.log("💰 Payment Recorded on Invoice:", payment.payment_id);

//       // E) Update Order Status
//       order.order_status = "delivered";
//       order.paymentDetails.payment_status = "paid";
//       order.statusUpdates.push({
//         status: "delivered",
//         updatedAt: new Date()
//       });

//       console.log(`🎯 Zoho Sales Order CLOSED! Final Total: ₹${invoice.total}`);
//     } else {
//       order.order_status = "ordered";
//       order.paymentDetails.payment_status = "success";
//     }

//     await order.save();
//     return so;

//   } catch (err) {
//     console.error(
//       "❌ createSalesOrderAndReleaseStock FAILED:",
//       err.response?.data || err.message
//     );
//     throw err;
//   }
// };
const axios = require("axios");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const {
  createZohoSalesOrder,
  confirmZohoSalesOrder,
  getZohoSalesOrder
} = require("../services/zohoSalesOrder.service");

const {
  createZohoCustomer,
  searchZohoCustomer,
  updateZohoCustomer,
  getZohoCustomerById
} = require("../services/zohoCustomer.service");

const {
  getLocationIdByName
} = require("../services/zohoLocationService");

const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
const { refreshZohoAccessToken } = require("../services/zohoTokenRefresh.service");

const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

/* ================= ZOHO REQUEST WITH AUTO-REFRESH ================= */
async function zohoRequest(config) {
  try {
    return await axios(config);
  } catch (err) {
    if (err.response?.status === 401) {
      console.log("🔄 Access token expired, refreshing token...");
      const newToken = await refreshZohoAccessToken();
      setAccessToken(newToken);
      config.headers = getZohoHeaders();
      return await axios(config);
    }
    throw err;
  }
}

/* ================= HELPER FUNCTIONS ================= */
function parseAddress(addressString = "") {
  const parts = addressString.split(",").map((p) => p.trim());
  return {
    address: parts.slice(0, 2).join(", "),
    city: parts[2] || "",
    state: parts[3] || "",
    zip: parts[4] || "",
    country: parts[5] || "India"
  };
}

function normalizeCustomerName(name, email) {
  if (name && name.trim().length >= 3) {
    return name
      .replace(/[^a-zA-Z\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  if (email) {
    return (
      email
        .split("@")[0]
        .replace(/[^a-zA-Z]/g, "")
        .replace(/\b\w/g, (c) => c.toUpperCase()) + " Customer"
    );
  }

  return "Relda Customer";
}

function getSerialNumbers(p, order, idx = 0) {
  const candidates = [
    p?.serialNumber,
    p?.productSerialNumber,
    p?.serial_number,
    p?.serialNo,
    p?.serial,
    order?.serialNumber,
    order?.productSerialNumber,
    order?.serial_number,
    order?.serialNo,
    order?.serial,
    order?.productDetails?.[idx]?.serialNumber,
    order?.productDetails?.[idx]?.productSerialNumber,
    order?.productDetails?.[idx]?.serial_number,
    order?.productDetails?.[idx]?.serialNo
  ];

  for (const val of candidates) {
    if (val && typeof val === "string" && val.trim().length > 0) {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(val) && val.length > 0) {
      return val.map((s) => String(s).trim()).filter(Boolean);
    }
  }

  if (Array.isArray(p?.serialNumbers) && p.serialNumbers.length > 0) {
    return p.serialNumbers.map((s) => String(s).trim()).filter(Boolean);
  }
  if (Array.isArray(order?.serialNumbers) && order.serialNumbers.length > 0) {
    if (order.productDetails?.length === 1) {
      return order.serialNumbers.map((s) => String(s).trim()).filter(Boolean);
    }
    if (order.serialNumbers[idx]) {
      return [String(order.serialNumbers[idx]).trim()];
    }
  }

  return [];
}

function calculateExactBaseRate(unitPrice, gstPercent = 18, quantity = 1) {
  const targetTotal = Number(unitPrice) * quantity;
  const halfGst = (gstPercent / 2) / 100;

  let bestRate = Number((unitPrice / (1 + gstPercent / 100)).toFixed(2));

  function computeTotal(r) {
    const lineSubTotal = Number((r * quantity).toFixed(2));
    const cgst = Number((lineSubTotal * halfGst).toFixed(2));
    const sgst = Number((lineSubTotal * halfGst).toFixed(2));
    return Number((lineSubTotal + cgst + sgst).toFixed(2));
  }

  let bestDiff = Math.abs(computeTotal(bestRate) - targetTotal);

  for (const delta of [0.01, -0.01, 0.02, -0.02]) {
    const testRate = Number((bestRate + delta).toFixed(2));
    const testDiff = Math.abs(computeTotal(testRate) - targetTotal);
    if (testDiff < bestDiff) {
      bestRate = testRate;
      bestDiff = testDiff;
    }
  }

  return bestRate;
}

/* ================= ZOHO FULFILLMENT INTERNAL API CALLS ================= */

async function createZohoPackage({ salesorder_id, line_items }) {
  const payload = {
    date: new Date().toISOString().split("T")[0],
    line_items: line_items.map((item) => ({
      so_line_item_id: item.so_line_item_id,
      quantity: item.quantity
    }))
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/packages?salesorder_id=${salesorder_id}`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.package;
}

async function createZohoShipmentDelivered({ salesorder_id, package_id }) {
  const payload = {
    date: new Date().toISOString().split("T")[0],
    delivery_method: "Hand Delivery",
    tracking_number: "SALE-IN-HAND"
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/shipmentorders?package_ids=${package_id}&salesorder_id=${salesorder_id}&is_delivered=true`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.shipmentorder;
}

async function createZohoInvoice({ salesorder_id, customer_id, line_items, adjustment }) {
  const payload = {
    customer_id,
    salesorder_id,
    date: new Date().toISOString().split("T")[0],
    line_items: line_items.map((item) => ({
      salesorder_item_id: item.so_line_item_id,
      item_id: item.item_id,
      quantity: item.quantity,
      rate: item.rate,
      description: item.description
    })),
    ...(adjustment && Math.abs(adjustment) > 0 ? {
      adjustment,
      adjustment_description: "Round Off"
    } : {})
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/invoices`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.invoice;
}

async function recordZohoPayment({ customer_id, invoice_id, amount, reference_number, payment_mode }) {
  const payload = {
    customer_id,
    payment_mode: payment_mode || "Cash",
    amount,
    date: new Date().toISOString().split("T")[0],
    reference_number: reference_number || "PAYMENT-REF",
    invoices: [
      {
        invoice_id,
        amount_applied: amount
      }
    ]
  };

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/customerpayments`,
    data: payload,
    headers: getZohoHeaders()
  });

  return res.data.payment;
}

/* ================= MAIN EXPORTED FUNCTION ================= */
module.exports = async function createSalesOrderAndReleaseStock(
  order,
  customerUser,
  reqUser
) {
  try {
    let zohoCustomerId = null;

    const isManageSales =
      customerUser?.role === "MANAGESALES" || reqUser?.role === "MANAGESALES";

    const effectiveUser = isManageSales
      ? (customerUser?.role === "MANAGESALES" ? customerUser : reqUser)
      : (reqUser || customerUser);

    console.log(`👤 Order Processed By: ${effectiveUser?.name || "System"} | Is ManageSales: ${isManageSales} | SaleInHand: ${Boolean(order.saleInHand)}`);

    // =========================================================================
    // 1️⃣ CUSTOMER RESOLUTION
    // =========================================================================
    const customerName = normalizeCustomerName(
      order.billing_name,
      order.billing_email
    );

    const customerData = {
      name: customerName,
      email: order.billing_email?.trim()?.toLowerCase(),
      mobile: order.billing_tel?.trim(),
      address: parseAddress(order.billing_address),
      isBusiness: !!order.gstDetails?.gstin,
      gstin: order.gstDetails?.gstin?.trim(),
      companyName: order.gstDetails?.companyName || customerName,
      gst_treatment: order.gstDetails?.gstin ? "business_gst" : "consumer"
    };

    if (isManageSales) {
      console.log(`💼 MANAGESALES Customer Sync -> Email: "${customerData.email}" | Phone: "${customerData.mobile}"`);

      const existingCustomer = await searchZohoCustomer({
        email: customerData.email,
        gstin: customerData.gstin,
        phone: customerData.mobile,
        name: customerData.name
      });

      if (existingCustomer) {
        zohoCustomerId = existingCustomer.contact_id;
        console.log(`✅ MANAGESALES: Existing Customer Linked: ${zohoCustomerId}`);
        await updateZohoCustomer(zohoCustomerId, customerData);
      } else {
        console.log(`🆕 MANAGESALES: Creating New Customer in Zoho: ${customerName}`);
        const created = await createZohoCustomer(customerData);
        zohoCustomerId = created.contact_id;
      }

      order.zohoCustomerId = zohoCustomerId;

    } else {
      if (customerUser?.zohoCustomerId) {
        const validContact = await getZohoCustomerById(customerUser.zohoCustomerId);
        if (validContact) {
          zohoCustomerId = validContact.contact_id;
        } else {
          customerUser.zohoCustomerId = null;
          await userModel.updateOne(
            { _id: customerUser._id },
            { $unset: { zohoCustomerId: 1 } }
          ).catch(() => {});
        }
      }

      if (!zohoCustomerId) {
        const existingCustomer = await searchZohoCustomer({
          email: customerData.email,
          gstin: customerData.gstin,
          phone: customerData.mobile,
          name: customerData.name
        });

        if (existingCustomer) {
          zohoCustomerId = existingCustomer.contact_id;
          await updateZohoCustomer(zohoCustomerId, customerData);
        } else {
          const created = await createZohoCustomer(customerData);
          zohoCustomerId = created.contact_id;
        }

        if (customerUser?._id && zohoCustomerId) {
          await userModel.updateOne(
            { _id: customerUser._id },
            { $set: { zohoCustomerId } }
          ).catch(() => {});
        }
      }
    }

    if (!zohoCustomerId) {
      throw new Error("Zoho customer ID could not be resolved from billing details");
    }

    // =========================================================================
    // 🏢 2️⃣ DYNAMIC LOCATION RESOLUTION (Test & Live org safe)
    // =========================================================================
    const headOfficeLocationId =
      (await getLocationIdByName("Head Office")) ||
      (await getLocationIdByName("RELDA")) ||
      "3477920000000032220";

    let targetWarehouseLocationId = null;

    if (isManageSales && order.saleInHand === true) {
      // 👉 RULE A: Sales Person WITH Sale In Hand -> Brandshop Location
      targetWarehouseLocationId =
        effectiveUser?.zohoLocationId ||
        (effectiveUser?.zohoLocationName ? await getLocationIdByName(effectiveUser.zohoLocationName) : null) ||
        (await getLocationIdByName("RELDA Brandshop - 1"));

      console.log(`🏬 MANAGESALES Sale In Hand -> Stock from Brandshop: ${targetWarehouseLocationId}`);
    } else {
      // 👉 RULE B: Normal User OR Sales Person WITHOUT Sale In Hand -> Vadaperubakkam
      // 🔥 DYNAMIC LOOKUP: Works in both Test org (347792...) and Live org (391238...)
      targetWarehouseLocationId =
        (await getLocationIdByName("Vadaperubakkam")) ||
        process.env.ZOHO_VADAPERUMBAKKAM_LOCATION_ID;

      console.log(`📦 Normal / Dispatch Order -> Stock from Vadaperubakkam: ${targetWarehouseLocationId}`);
    }

    if (!targetWarehouseLocationId) {
      // Final fallback if name search returned null
      targetWarehouseLocationId = "3477920000000210001";
    }

    // =========================================================================
    // 3️⃣ PREPARE SALES ORDER LINE ITEMS
    // =========================================================================
    const allCollectedSerials = [];

    const line_items = await Promise.all(
      order.productDetails.map(async (p, idx) => {
        const prod = await productModel.findById(p.productId);
        if (!prod?.zohoVariantId) {
          throw new Error(`Zoho item missing for product ${p.productId}`);
        }

        const serial_numbers = getSerialNumbers(p, order, idx);
        allCollectedSerials.push(...serial_numbers);

        const inclusivePrice = Number(p.sellingPrice || prod.sellingPrice || 0);
        const gstRate = Number(prod.gstPercent || p.gstPercent || 18);
        const quantity = Number(p.quantity || 1);

        const exactBaseRate = calculateExactBaseRate(inclusivePrice, gstRate, quantity);

        return {
          item_id: prod.zohoVariantId,
          quantity: p.quantity,
          rate: exactBaseRate,
          location_id: targetWarehouseLocationId, // 👈 Dynamic Vadaperubakkam / Brandshop ID
          description: serial_numbers.length > 0 ? `Serial No: ${serial_numbers.join(", ")}` : (prod.productName || "Product")
        };
      })
    );

    const uniqueSerials = [...new Set(allCollectedSerials)];
    const serialNotes = uniqueSerials.length > 0 ? ` | Serial: ${uniqueSerials.join(", ")}` : "";

    // =========================================================================
    // 4️⃣ TOTAL & ROUND-OFF VERIFICATION
    // =========================================================================
    const expectedTotal = Number(
      order.totalAmount ||
      order.productDetails.reduce((sum, p) => sum + (Number(p.sellingPrice || 0) * Number(p.quantity || 1)), 0)
    );

    const calculatedSubTotal = line_items.reduce((sum, item) => sum + (Number(item.rate) * Number(item.quantity)), 0);
    const calculatedTaxTotal = line_items.reduce((sum, item) => {
      const lineAmt = Number(item.rate) * Number(item.quantity);
      const cgst = Number((lineAmt * 0.09).toFixed(2));
      const sgst = Number((lineAmt * 0.09).toFixed(2));
      return sum + cgst + sgst;
    }, 0);

    const zohoEstimatedTotal = Number((calculatedSubTotal + calculatedTaxTotal).toFixed(2));
    const roundOffDiff = Number((expectedTotal - zohoEstimatedTotal).toFixed(2));

    const payload = {
      customer_id: zohoCustomerId,
      date: new Date().toISOString().split("T")[0],
      reference_number: order.orderId,
      notes: `${order.saleInHand ? "Hand Sale" : "Order created from Website"}${serialNotes}`,
      line_items,
      ...(headOfficeLocationId ? { location_id: headOfficeLocationId } : {}),
      ...(Math.abs(roundOffDiff) > 0 && Math.abs(roundOffDiff) <= 5 ? {
        adjustment: roundOffDiff,
        adjustment_description: "Round Off"
      } : {})
    };

    if (isManageSales) {
      payload.salesperson_name = effectiveUser?.name || "MANAGESALES";
    }

    console.log("📦 FINAL ZOHO SO PAYLOAD:", JSON.stringify(payload, null, 2));

    // 5️⃣ CREATE & CONFIRM SALES ORDER
    const so = await createZohoSalesOrder(payload);
    await confirmZohoSalesOrder(so.salesorder_id);
    console.log(`✅ Zoho Sales Order Created & Confirmed in Warehouse: ${targetWarehouseLocationId}`);

    order.zohoSalesOrderId = so.salesorder_id;

    // =========================================================================
    // 6️⃣ SALE IN HAND / AUTO-CLOSE INVOICE FLOW
    // =========================================================================
    if (order.saleInHand === true) {
      console.log("⚡ Sale in Hand detected -> Auto-fulfilling & Closing Invoice for:", order.orderId);

      const fullSO = await getZohoSalesOrder(so.salesorder_id);
      const soLines = fullSO?.salesorder?.line_items || fullSO?.line_items || [];

      const fulfillmentItems = soLines.map((li, idx) => {
        const itemDetail = order.productDetails?.[idx];
        const serial_numbers = getSerialNumbers(itemDetail, order, idx);
        const soLineId = li.line_item_id || li.so_line_item_id || li.salesorder_item_id;

        return {
          so_line_item_id: soLineId,
          item_id: li.item_id,
          quantity: li.quantity,
          rate: li.rate,
          description: serial_numbers.length > 0 ? `Serial No: ${serial_numbers.join(", ")}` : (li.description || "Product")
        };
      });

      // A) Create Package
      const pkg = await createZohoPackage({
        salesorder_id: so.salesorder_id,
        line_items: fulfillmentItems
      });
      order.zohoPackageId = pkg.package_id;
      console.log("📦 Package Created:", pkg.package_id);

      // B) Create Shipment and Mark as Delivered
      const shipment = await createZohoShipmentDelivered({
        salesorder_id: so.salesorder_id,
        package_id: pkg.package_id
      });
      order.zohoShipmentOrderId = shipment.shipmentorder_id;
      console.log("🚚 Shipment Marked as Delivered from Location:", targetWarehouseLocationId);

      // C) Create Invoice against Sales Order
      const invoice = await createZohoInvoice({
        salesorder_id: so.salesorder_id,
        customer_id: zohoCustomerId,
        line_items: fulfillmentItems,
        adjustment: Math.abs(roundOffDiff) > 0 && Math.abs(roundOffDiff) <= 5 ? roundOffDiff : 0
      });
      order.zohoInvoiceId = invoice.invoice_id;
      console.log("🧾 Invoice Generated:", invoice.invoice_id);

      // D) Record Payment on Invoice
      const isCash =
        order.paymentDetails?.payment_method_type === "CASH" ||
        order.paymentDetails?.payment_status === "cash_on_hand";

      const paymentModeForZoho = isCash ? "Cash" : "Razorpay";
      const paymentRefNumber = order.paymentDetails?.paymentId || order.orderId;

      const payment = await recordZohoPayment({
        customer_id: zohoCustomerId,
        invoice_id: invoice.invoice_id,
        amount: invoice.total || expectedTotal,
        reference_number: paymentRefNumber,
        payment_mode: paymentModeForZoho
      });

      order.zohoPaymentId = payment.payment_id;
      console.log(`💰 Payment Recorded on Invoice (${paymentModeForZoho}): ${payment.payment_id}`);

      // E) Update Order Status in Local Database
      order.order_status = "delivered";
      order.paymentDetails.payment_status = "paid";
      order.statusUpdates.push({
        status: "delivered",
        updatedAt: new Date()
      });

      console.log(`🎯 Zoho Sales Order & Invoice are now fully CLOSED & PAID! Total: ₹${invoice.total}`);
    } else {
      order.order_status = "ordered";
      order.paymentDetails.payment_status = "success";
    }

    await order.save();
    return so;

  } catch (err) {
    console.error(
      "❌ createSalesOrderAndReleaseStock FAILED:",
      err.response?.data || err.message
    );
    throw err;
  }
};