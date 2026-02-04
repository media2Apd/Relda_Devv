const productModel = require("../models/productModel");
const {
  createSalesOrder,
  confirmSalesOrder,
  createInvoice,
  recordPayment
} = require("../services/zohoOrderFlow.service");

module.exports = async function createZohoOrderInvoicePaid({
  order,
  user,
  razorpayPaymentId
}) {

  // 🔹 Prepare products
  const products = await Promise.all(
    order.productDetails.map(async (p) => {
      const prod = await productModel.findById(p.productId);
      if (!prod?.zohoVariantId) {
        throw new Error("Zoho Variant ID missing");
      }
      return {
        zohoVariantId: prod.zohoVariantId,
        quantity: p.quantity,
        sellingPrice: p.sellingPrice
      };
    })
  );

  // 1️⃣ Sales Order
  const so = await createSalesOrder({ user, order, products });

  // 2️⃣ Confirm SO
  await confirmSalesOrder(so.salesorder_id);

  // 3️⃣ Invoice
  const invoice = await createInvoice(so.salesorder_id);

  // 4️⃣ Payment
  await recordPayment({
    invoice,
    amount: order.totalAmount,
    paymentId: razorpayPaymentId
  });

  // 5️⃣ Save IDs
  order.zohoSalesOrderId = so.salesorder_id;
  order.zohoInvoiceId = invoice.invoice_id;
  await order.save();

  // 6️⃣ Release reserved stock
  for (const p of order.productDetails) {
    await productModel.findByIdAndUpdate(
      p.productId,
      { $inc: { reservedStock: -p.quantity } }
    );
  }

  return { so, invoice };
};
