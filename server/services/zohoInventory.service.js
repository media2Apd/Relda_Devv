// const axios = require("axios")
// const { ZOHO_BASE_URL, ORG_ID, ACCESS_TOKEN } = require("../config/zoho.config")

// const zohoHeaders = {
//   Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//   "X-com-zoho-inventory-organizationid": ORG_ID
// }

// // 🔹 Fetch all items from Zoho
// exports.fetchZohoItems = async () => {
//   const res = await axios.get(`${ZOHO_BASE_URL}/items`, {
//     headers: zohoHeaders
//   })
//   return res.data.items
// }

// // 🔹 Create item in Zoho
// exports.createZohoItem = async (product) => {
//   const payload = {
//     name: product.productName,
//     rate: product.sellingPrice,
//     purchase_rate: product.price,
//     initial_stock: product.availability,
//     item_type: "inventory",
//     unit: "pcs",
//     brand: product.brandName,
//     category_name: product.category,
//     description: product.description
//   }

//   const res = await axios.post(
//     `${ZOHO_BASE_URL}/items`,
//     payload,
//     { headers: zohoHeaders }
//   )

//   return res.data.item
// }

const axios = require("axios")
const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders")
const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service")

async function zohoRequest(url, method = "GET", data = null) {
  try {
    return await axios({
      url,
      method,
      data,
      headers: getZohoHeaders()
    })
  } catch (err) {
    // Token expired
    if (err.response?.status === 401) {
      const newToken = await refreshZohoAccessToken()
      setAccessToken(newToken)

      return await axios({
        url,
        method,
        data,
        headers: getZohoHeaders()
      })
    }
    throw err
  }
}

// exports.fetchZohoItems = async () => {
//   const res = await zohoRequest(
//     "https://www.zohoapis.in/inventory/v1/items"
//   )
//   return res.data.items
// }
exports.fetchZohoItems = async () => {
  const res = await zohoRequest({
    method: "GET",
    url: "https://www.zohoapis.in/inventory/v1/items",
    headers: getZohoHeaders()
  });

  return res.data.items;
};


// exports.fetchZohoItems = async () => {
//   const res = await axios.get(
//     "https://www.zohoapis.in/inventory/v1/items",
//     { headers: getZohoHeaders() }
//   )
//   return res.data.items
// }


exports.createZohoItem = async (product) => {
  const payload = {
    name: product.productName,
    rate: product.sellingPrice,
    purchase_rate: product.price,
    initial_stock: product.availability,
    item_type: "inventory",
    unit: "pcs",
    brand: product.brandName,
    category_name: product.category,
    description: product.description
  };

  const res = await axios.post(
    "https://www.zohoapis.in/inventory/v1/items",
    payload,
    { headers: getZohoHeaders() }
  );

  return res.data.item;
};   
async function zohoRequest(config) {
  try {
    return await axios(config);
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshZohoAccessToken();
      setAccessToken(newToken);
      config.headers = getZohoHeaders();
      return await axios(config);
    }
    throw err;
  }
}

exports.createZohoSalesOrder = async ({
  customerId,
  order,
  products
}) => {
  const payload = {
    customer_id: customerId,
    reference_number: order.orderId,
    date: new Date().toISOString().split("T")[0],
    line_items: products.map(p => ({
      item_id: p.zohoVariantId,
      quantity: p.quantity,
      rate: p.sellingPrice
    })),
    billing_address: {
      address: order.billing_address
    },
    shipping_address: {
      address: order.shipping_address
    },
    notes: `Razorpay Order: ${order.orderId}`
  };

  const response = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/salesorders`,
    headers: getZohoHeaders(),
    data: payload
  });

  return response.data.salesorder;
};