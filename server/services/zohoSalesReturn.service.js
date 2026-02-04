// // services/zohoSalesReturn.service.js
// // services/zohoSalesReturn.service.js
// const axios = require("axios");
// const { getZohoHeaders } = require("../config/zohoAuth");
// const { getDefaultLocationId } = require("./zohoLocation.service");

// exports.createZohoSalesReturn = async ({ reason, line_items }) => {
//   const headers = await getZohoHeaders();

//   // 🔥 FORCE location_id
//   const location_id = await getDefaultLocationId();

//   if (!location_id) {
//     throw new Error("Zoho location_id missing");
//   }

//   const payload = {
//     date: new Date().toISOString().split("T")[0],
//     reason,
//     location_id,                 // ✅ GUARANTEED
//     line_items: line_items.map(i => ({
//       item_id: i.item_id,
//       quantity: i.quantity
//     }))
//   };

//   console.log("📦 FINAL SALES RETURN PAYLOAD:", payload);

//   const res = await axios.post(
//     "https://www.zohoapis.in/inventory/v1/salesreturns",
//     payload,
//     { headers }
//   );

//   return res.data.salesreturn;
// };
const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");

exports.createZohoSalesReturn = async ({
  salesorder_id,
  location_id,
  line_items,
  reason = "customer_return"
}) => {

  if (!salesorder_id) {
    throw new Error("salesorder_id is required");
  }

  const headers = await getZohoHeaders();

  const payload = {
    date: new Date().toISOString().split("T")[0],
    reason,
    location_id,
    line_items
  };

  console.log("📦 SALES RETURN PAYLOAD:", payload);

  const res = await axios.post(
    `https://www.zohoapis.in/inventory/v1/salesreturns?organization_id=60013451386&salesorder_id=${salesorder_id}`,
    payload,
    { headers }
  );

  return res.data.salesreturn; // 🔥 VERY IMPORTANT
};
