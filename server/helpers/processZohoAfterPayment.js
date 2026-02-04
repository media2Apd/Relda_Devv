// const {
//   confirmZohoSalesOrder,
//   createInvoiceFromSalesOrder,
//   recordZohoPayment
// } = require("../services/zohoSalesOrder.service");

// module.exports = async ({ order, razorpayPaymentId }) => {

//   // 1️⃣ Confirm Sales Order
//   await confirmZohoSalesOrder(order.zohoSalesOrderId);

//   // 2️⃣ Create Invoice
//   const invoice = await createInvoiceFromSalesOrder(order.zohoSalesOrderId);

//   // 3️⃣ Record Payment (mark as PAID)
//   await recordZohoPayment({
//     invoiceId: invoice.invoice_id,
//     amount: order.totalAmount,
//     paymentId: razorpayPaymentId
//   });
// };

const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");

module.exports = async function processZohoAfterPayment({
  order,
  razorpayPaymentId
}) {
  const headers = await getZohoHeaders();

  // =========================
  // 1️⃣ CONFIRM SALES ORDER
  // =========================
  await axios.post(
    `https://www.zohoapis.in/inventory/v1/salesorders/${order.zohoSalesOrderId}/status/confirmed`,
    {},
    { headers }
  );

  // =========================
//   // 2️⃣ CREATE INVOICE
//   // =========================
//   const invoiceRes = await axios.post(
//     "https://www.zohoapis.in/inventory/v1/invoices",
//     {
//       customer_id: order.zohoCustomerId,
//       salesorder_id: order.zohoSalesOrderId
//     },
//     { headers }
//   );

//   const invoice = invoiceRes.data.invoice;

//   // =========================
//   // 3️⃣ RECORD PAYMENT
//   // =========================
//   await axios.post(
//     "https://www.zohoapis.in/inventory/v1/customerpayments",
//     {
//       customer_id: order.zohoCustomerId,
//       payment_mode: "Razorpay",
//       amount: invoice.total,
//       reference_number: razorpayPaymentId,
//       date: new Date().toISOString().split("T")[0],
//       invoices: [
//         {
//           invoice_id: invoice.invoice_id,
//           amount_applied: invoice.total
//         }
//       ]
//     },
//     { headers }
//   );

  return {
    success: true,
    // invoiceId: invoice.invoice_id
  };
};

