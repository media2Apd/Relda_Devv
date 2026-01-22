const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");
const logZohoError = require("../utils/logZohoError");

const BASE = "https://www.zohoapis.in/inventory/v1";

/* =========================
   CREATE SALES ORDER
========================= */
exports.createSalesOrder = async ({ customerId, orderId, items }) => {
  const payload = {
    customer_id: customerId,
    reference_number: orderId,
    date: new Date().toISOString().split("T")[0],
    line_items: items.map(i => ({
      item_id: i.zohoVariantId,
      quantity: i.quantity,
      rate: i.rate
    }))
  };

  console.log("🟢 SALES ORDER PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const headers = await getZohoHeaders();
    const res = await axios.post(`${BASE}/salesorders`, payload, { headers });
    return res.data.salesorder;
  } catch (err) {
    logZohoError(err, "CREATE_SALES_ORDER");
    throw err;
  }
};

/* =========================
   CONFIRM SALES ORDER
========================= */
exports.confirmSalesOrder = async (salesOrderId) => {
  console.log("🟡 CONFIRMING SALES ORDER:", salesOrderId);
  try {
    const headers = await getZohoHeaders();
    await axios.post(
      `${BASE}/salesorders/${salesOrderId}/status/confirmed`,
      {},
      { headers }
    );
  } catch (err) {
    logZohoError(err, "CONFIRM_SALES_ORDER");
    throw err;
  }
};

/* =========================
   CREATE INVOICE
========================= */
exports.createInvoice = async (salesOrderId) => {
  console.log("🟠 CREATING INVOICE FOR:", salesOrderId);
  try {
    const headers = await getZohoHeaders();
    const res = await axios.post(
      `${BASE}/invoices`,
      { salesorder_id: salesOrderId },
      { headers }
    );
    return res.data.invoice;
  } catch (err) {
    logZohoError(err, "CREATE_INVOICE");
    throw err;
  }
};

/* =========================
   APPLY PAYMENT
========================= */
exports.applyPayment = async ({ invoice, razorpayPaymentId }) => {
  const payload = {
    customer_id: invoice.customer_id,
    payment_mode: "Online",
    amount: Number(invoice.balance),
    reference_number: razorpayPaymentId,
    date: new Date().toISOString().split("T")[0],
    invoices: [
      {
        invoice_id: invoice.invoice_id,
        amount_applied: Number(invoice.balance)
      }
    ]
  };

  console.log("🔵 PAYMENT PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const headers = await getZohoHeaders();
    const res = await axios.post(
      `${BASE}/customerpayments`,
      payload,
      { headers }
    );
    return res.data.customerpayment;
  } catch (err) {
    logZohoError(err, "CREATE_PAYMENT");
    throw err;
  }
};
