const axios = require("axios")

async function test() {
  try {
    const res = await axios.post(
      "https://accounts.zoho.in/oauth/v2/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: "1000.3PMKX4TN31V6GWAS0V1CNY00FBX8JM",
          client_secret: "1764cc04d5ecf00e51dff93969fea738a833aa3240",
          redirect_uri: "http://localhost:8080/zoho/callback",
          code: "1000.80168dca80ce8d2bcac6c7b42a888347.3d1676dde0a8ca91c341a9125ddf5b13"
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
