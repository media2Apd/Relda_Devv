// utils/gst.util.js
exports.calculateInclusivePrice = (basePrice, gstPercent = 18) => {
  const price = Number(basePrice || 0);

  const inclusive = price * (1 + gstPercent / 100);

  // round to 2 decimals (money safe)
  return Math.round(inclusive * 100) / 100;
};
