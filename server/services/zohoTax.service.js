const { getZohoHeaders } = require("../config/zohoHeaders");
const axios = require("axios");

const TAX_CACHE = {}; // 🔥 avoid repeated API calls

exports.getGSTPercentByTaxId = async (taxId) => {
  if (!taxId) return null;

  if (TAX_CACHE[taxId]) {
    return TAX_CACHE[taxId];
  }

  const res = await axios.get(
    "https://www.zohoapis.in/inventory/v1/settings/taxes",
    { headers: getZohoHeaders() }
  );

  const taxes = res.data.taxes || [];

  for (const tax of taxes) {
    TAX_CACHE[tax.tax_id] = Number(tax.tax_percentage);
  }

  return TAX_CACHE[taxId] || null;
};
