
// import { syncZohoVariantsAsProducts } from "./zohoSync.controller";
const { syncZohoVariantsAsProducts } = require("./zohoSync.controller");
exports.manualZohoProductSync = async (req, res) => {
  try {
    await syncZohoVariantsAsProducts();

    return res.json({
      success: true,
      message: "Zoho products synced successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};