const axios = require("axios")

exports.generateTokens = async (authCode) => {
  const res = await axios.post(
    "https://accounts.zoho.in/oauth/v2/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        code: authCode
      }
    }
  )
  console.log(res.data);
  return res.data

  
}
