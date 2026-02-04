// services/zohoLocation.service.js
const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");

exports.getDefaultLocationId = async () => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    "https://www.zohoapis.in/inventory/v1/locations",
    { headers }
  );

  const locations = res.data.locations;

  if (!locations || !locations.length) {
    throw new Error("No locations found in Zoho");
  }

  return locations[0].location_id; // ✅ SAFE
};
