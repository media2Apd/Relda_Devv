const axios = require("axios");
require("dotenv").config();

const ZOHO_INVENTORY_BASE_URL = "https://inventory.zoho.com/api/v1";
const ZOHO_ORGANIZATION_ID = process.env.ZOHO_ORGANIZATION_ID; // add to .env

// Reuse ACCESS_TOKEN and refreshAccessToken from your existing code
let ACCESS_TOKEN = null;

async function refreshAccessToken() {
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

  try {
    const res = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    });

    ACCESS_TOKEN = res.data.access_token;
    console.log("✅ Zoho access token refreshed");
    return ACCESS_TOKEN;
  } catch (err) {
    console.error("❌ Token refresh failed:", err.response?.data || err.message);
    throw new Error("Token refresh failed. Please regenerate tokens.");
  }
}

// Function to get current valid token, refresh if expired
async function getAccessToken() {
  if (!ACCESS_TOKEN) {
    await refreshAccessToken();
  }
  return ACCESS_TOKEN;
}

async function addOrUpdateInventoryItem(product) {
  try {
    const token = await getAccessToken();

    const payload = {
      name: product.productName,
      description: product.description || "No description",
      rate: product.sellingPrice || product.price || 0,
      sku: `SKU-${product._id.toString().slice(-6)}`,
      product_type: "goods",
      purchase_rate: product.price || 0,
      brand: product.brandName || "Default",
      stock_on_hand: product.availability || 0,
      image_url:
        Array.isArray(product.productImage) && product.productImage[0]
          ? typeof product.productImage[0] === "string"
            ? product.productImage[0]
            : product.productImage[0].url || ""
          : "",
    };

    // Search if SKU exists already
    const existing = await axios.get(
      `${ZOHO_INVENTORY_BASE_URL}/items?sku=${payload.sku}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "X-com-zoho-inventory-organizationid": ZOHO_ORGANIZATION_ID,
        },
      }
    );

    if (existing.data.items && existing.data.items.length > 0) {
      // Update existing item
      const itemId = existing.data.items[0].item_id;

      await axios.put(
        `${ZOHO_INVENTORY_BASE_URL}/items/${itemId}`,
        { item: payload },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            "X-com-zoho-inventory-organizationid": ZOHO_ORGANIZATION_ID,
          },
        }
      );

      console.log("📦 Inventory item updated");

    } else {
      // Create new item
      await axios.post(
        `${ZOHO_INVENTORY_BASE_URL}/items`,
        { item: payload },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${token}`,
            "X-com-zoho-inventory-organizationid": ZOHO_ORGANIZATION_ID,
          },
        }
      );

      console.log("🆕 Inventory item created");
    }
  } catch (err) {
    console.error("❌ Inventory sync failed:", err.response?.data || err.message);
  }
}

module.exports = {
  refreshAccessToken,
  getAccessToken,
  addOrUpdateInventoryItem,
};
