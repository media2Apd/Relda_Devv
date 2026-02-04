const axios = require("axios");

let zohoAccessToken = process.env.ZOHO_ACCESS_TOKEN;
let tokenExpiry = 0;

const refreshZohoToken = async () => {
  console.log("🔄 Refreshing Zoho access token...");

  const res = await axios.post(
    "https://accounts.zoho.in/oauth/v2/token",
    null,
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token"
      }
    }
  );

  zohoAccessToken = res.data.access_token;
  tokenExpiry = Date.now() + res.data.expires_in * 1000;

  console.log("✅ Zoho token refreshed");
  return zohoAccessToken;
};

exports.getZohoHeaders = async () => {
  if (!zohoAccessToken || Date.now() >= tokenExpiry) {
    await refreshZohoToken();
  }

  return {
    Authorization: `Zoho-oauthtoken ${zohoAccessToken}`,
    "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
    "Content-Type": "application/json"
  };
};
