const axios = require("axios");
const { getZohoHeaders } = require("../config/zohoAuth");

/* ================= GET ALL LOCATIONS ================= */
const getZohoLocations = async () => {
  const headers = await getZohoHeaders();

  const res = await axios.get(
    "https://www.zohoapis.in/inventory/v1/locations",
    { headers }
  );

  return res.data.locations || [];
};

/* ================= GET LOCATION ID BY NAME ================= */
const getLocationIdByName = async (locationName) => {
  const locations = await getZohoLocations();

  const location = locations.find(
    l => l.location_name.toLowerCase() === locationName.toLowerCase()
  );

  return location?.location_id || null;
};

/* ================= EXPORTS ================= */
module.exports = {
  getZohoLocations,
  getLocationIdByName
};
