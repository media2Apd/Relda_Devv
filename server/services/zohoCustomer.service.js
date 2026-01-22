const axios = require("axios");
const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service");

const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

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

exports.createZohoCustomer = async (user) => {
  const payload = {
    contact_name: user.name,
    company_name: user.name,
    contact_type: "customer",
    email: user.email,
    phone: user.mobile,
    billing_address: {
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.pinCode || "",
      country: user.address?.country || "India"
    },
    shipping_address: {
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.pinCode || "",
      country: user.address?.country || "India"
    }
  };

  const response = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/contacts`,
    headers: {
      ...getZohoHeaders(),
      "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID
    },
    data: payload
  });

  return response.data.contact;
};
