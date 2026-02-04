const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");

exports.getInvoiceBySalesOrderId = async (salesOrderId) => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    "https://www.zohoapis.in/inventory/v1/invoices",
    {
      headers,
      params: {
        salesorder_id: salesOrderId
      }
    }
  );

  const invoices = res.data.invoices || [];

  if (invoices.length === 0) return null;

  // usually only one invoice per SO
  return invoices[0];
};

exports.getInvoiceDetails = async (invoiceId) => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    `https://www.zohoapis.in/inventory/v1/invoices/${invoiceId}`,
    { headers }
  );

  return res.data.invoice;
};
