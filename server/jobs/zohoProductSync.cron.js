// jobs/zohoProductSync.cron.js

const cron = require("node-cron");
const {
  syncZohoVariantsAsProducts
} = require("../controller/product/zohoSync.controller");

// cron.schedule("0 */2 * * *", async () => {
    cron.schedule("*/2 * * * *", async () => {
  console.log("⏰ Cron: Zoho product sync started");

  try {
    await syncZohoVariantsAsProducts();
    console.log("✅ Cron: Zoho product sync completed");
  } catch (err) {
    console.error("❌ Cron: Zoho product sync failed", err.message);
  }
});
