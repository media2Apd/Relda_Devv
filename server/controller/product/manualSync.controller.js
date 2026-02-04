
// import { syncZohoVariantsAsProducts } from "./zohoSync.controller";
const { syncZohoVariantsAsProducts } = require("./zohoSync.controller");
exports.manualZohoProductSync = async (req, res) => {
  try {
    syncZohoVariantsAsProducts(); // fire & forget

    return res.json({
      success: true,
      message: "Zoho product sync triggered"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};