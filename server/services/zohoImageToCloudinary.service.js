const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service");

exports.uploadZohoImageToCloudinary = async (itemId) => {
  try {
    const url = `https://www.zohoapis.in/inventory/v1/items/${itemId}/image?organization_id=${process.env.ZOHO_ORG_ID}`;

    let response;

    try {
      response = await axios.get(url, {
        responseType: "arraybuffer",
        headers: getZohoHeaders()
      });
    } catch (err) {
      // 🔥 TOKEN EXPIRED CASE
      if (err.response?.status === 401) {
        console.log("🔄 Zoho token expired, refreshing...");

        const newToken = await refreshZohoAccessToken();
        setAccessToken(newToken);

        response = await axios.get(url, {
          responseType: "arraybuffer",
          headers: getZohoHeaders()
        });
      } else {
        throw err;
      }
    }

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "zoho-products" },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        }
      );

      streamifier.createReadStream(response.data).pipe(uploadStream);
    });

  } catch (error) {
    console.error("Zoho → Cloudinary image error:", error.message);
    return null;
  }
};
