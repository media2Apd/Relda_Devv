exports.mapCancelReasonToZoho = (reasonText = "") => {
  const r = reasonText.toLowerCase();

  if (r.includes("mistake") || r.includes("customer")) {
    return "customer_cancelled";
  }

  if (r.includes("payment")) {
    return "payment_failed";
  }

  if (r.includes("stock")) {
    return "out_of_stock";
  }

  return "not_required"; // ✅ safe default
};
