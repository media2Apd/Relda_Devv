const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");

exports.getZohoSalesOrder = async (salesOrderId) => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    `https://www.zohoapis.in/inventory/v1/salesorders/${salesOrderId}`,
    { headers }
  );

  const so = res.data.salesorder;

  // 🔥 IMPORTANT: explicitly return what we need
  return {
    status: so.status,                         // confirmed / shipped / closed
    shipment_status: so.shipment_status,       // sometimes undefined
    invoice_status: so.invoice_status,
    packages_count: so.packages_count || 0     // 🔥 THIS WAS MISSING
  };
};
