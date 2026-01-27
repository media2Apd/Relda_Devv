const axios = require("axios")

async function test() {
  try {
    const res = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: "1000.29H8S1FX4NGU97NXC07F0JBUWKJ9QD",
          client_secret: "e260d652ad17b295a1f1e31272f4d8d3b585e6030e",
          redirect_uri: "http://localhost:8080/zoho/callback",
          code: "1000.4f797d149f00d9373a5b5f1538df7f01.f7bd8e900d3dc16f4094a91b61ffbd98"
        }
      }
    )

    console.log("ZOHO TOKEN RESPONSE 👇")
    console.log(res.data)

  } catch (err) {
    console.log("❌ ERROR RESPONSE")
    console.log(err.response?.data || err.message)
  }
}

test()
