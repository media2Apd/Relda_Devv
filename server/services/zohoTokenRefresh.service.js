const axios = require("axios")

exports.refreshZohoAccessToken = async () => {
  const res = await axios.post(
    "https://accounts.zoho.in/oauth/v2/token",
    null,
    {
      params: {
        grant_type: "refresh_token",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN
      }
    }
  )

  return res.data.access_token
}
