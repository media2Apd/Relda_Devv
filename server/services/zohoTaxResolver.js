/**
 * Zoho has 2 tax models:
 * 1. tax_percentage exists → use it (non-India / simple sales tax)
 * 2. India GST → item does NOT expose GST → handled at Sales Order
 */

// For display only, extract GST % from Zoho's tax name string.
exports.resolveGSTFromItem = (item) => {
  /* ===============================
     ✅ PRIMARY: item_tax_preferences
     =============================== */
  if (
    Array.isArray(item.item_tax_preferences) &&
    item.item_tax_preferences.length > 0
  ) {
    // Prefer INTRA (GST) for India catalog pricing
    const intraTax = item.item_tax_preferences.find(
      t => t.tax_specification === "intra"
    );

    if (intraTax && intraTax.tax_percentage != null) {
      return Number(intraTax.tax_percentage);
    }

    // Fallback to any available tax
    const anyTax = item.item_tax_preferences.find(
      t => t.tax_percentage != null
    );

    if (anyTax) {
      return Number(anyTax.tax_percentage);
    }
  }

  /* ===============================
     🟡 FALLBACK: legacy fields
     =============================== */
  if (item.is_taxable && item.tax_percentage != null && item.tax_percentage > 0) {
    return Number(item.tax_percentage);
  }

  return null; // handled as GST-exclusive
};

exports.calculateInclusivePrice = (basePrice, gstPercent) => {
  return Math.round(basePrice * (1 + gstPercent / 100));
};
