const cron = require("node-cron");
const { syncZohoOrderStatuses } = require("./zohoOrderStatusSync");

// Every 1 hour
// cron.schedule("0 * * * *", async () => {
//   await syncZohoOrderStatuses();
// });

cron.schedule("*/2 * * * *", async () => {
  console.log("⏱ Zoho Sync Started (2 mins)");
  await syncZohoOrderStatuses();
});
