const axios = require("axios");
const { getZohoHeaders } = require('../config/zohoAuth')

const zohoRequest = async ({ method, url, data = {} }) => {
  const headers = await getZohoHeaders();

  headers["Content-Type"] = "application/json";
  headers["X-com-zoho-inventory-organizationid"] =
    process.env.ZOHO_ORG_ID;

  return axios({
    method,
    url,
    headers,
    data
  });
};

module.exports = { zohoRequest };
