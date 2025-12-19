require("dotenv").config();
const axios = require("axios");

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, AUTH_CODE } = process.env;

async function generateTokens() {
  try {
    const response = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        grant_type: "authorization_code",
        code: AUTH_CODE,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }
    });

    console.log("✅ Access Token:", response.data.access_token);
    console.log("✅ Refresh Token:", response.data.refresh_token);
  } catch (error) {
    console.error("❌ Failed to generate tokens:", error.response?.data || error.message);
  }
}

generateTokens();
