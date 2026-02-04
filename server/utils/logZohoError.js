module.exports = function logZohoError(err, label = "ZOHO_ERROR") {
  console.log("\n🔥🔥🔥 ZOHO ERROR 🔥🔥🔥");
  console.log("📍 Label:", label);
  console.log("📍 Status:", err.response?.status);
  console.log(
    "📍 Data:",
    JSON.stringify(err.response?.data, null, 2)
  );
  console.log("🔥🔥🔥 END 🔥🔥🔥\n");
};
