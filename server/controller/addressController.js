// const axios = require("axios");

// // Address validation logic
// const validateAddress = async (req, res) => {
//   const { country, city, street, postalCode } = req.body;

//   // Check if all required fields are provided
//   if (!country || !city || !street || !postalCode) {
//     return res.status(400).json({ valid: false, message: "Missing address fields: country, city, street, or postal code." });
//   }

//   try {
//     // Prepare the query for geocoding with postal code, street, city, and country
//     const geocodeResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
//       params: {
//         format: "json",
//         country: country,
//         city: city,
//         street: street,
//         postalcode: postalCode,  // Include postal code in the query
//         limit: 1,
//       },
//     });

//     console.log("Geocode API Response:", geocodeResponse.data);

//     // Check if we get a valid response
//     if (geocodeResponse.data.length === 0) {
//       console.log("Detailed address not found, trying a more general search...");
//       const geocodeFallbackResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
//         params: {
//           format: "json",
//           country: country,
//           city: city,
//           postalcode: postalCode,  // Use postal code only in fallback
//           limit: 1,
//         },
//       });

//       if (geocodeFallbackResponse.data.length === 0) {
//         return res.status(400).json({ valid: false, message: "Address not found." });
//       }

//       return res.json({
//         valid: true,
//         location: geocodeFallbackResponse.data[0],
//         message: "Address partially matched with city, country, and postal code.",
//       });
//     }

//     const location = geocodeResponse.data[0];

//     // Check if the postal code in the result matches the one provided
//     if (location.address.postcode && location.address.postcode !== postalCode) {
//       return res.status(400).json({ valid: false, message: "Postal code mismatch." });
//     }

//     return res.json({ valid: true, location });

//   } catch (error) {
//     console.error("Error validating address:", error.message);
//     return res.status(500).json({ valid: false, message: "Error validating address." });
//   }
// };

// module.exports = { validateAddress };


// const axios = require("axios");

// // Utility to simplify street address
// const preprocessAddress = (street) => {
//   // Simplify overly detailed addresses (e.g., remove house numbers, extra locality mentions)
//   return street.replace(/No\s*\d+,?/i, "").trim(); // Example: Remove "No 38,"
// };

// // Address validation logic
// const validateAddress = async (req, res) => {
//   let { country, city, street, postalCode } = req.body;

//   // Check if all required fields are provided
//   if (!country || !city || !street || !postalCode) {
//     return res.status(400).json({ valid: false, message: "Missing address fields: country, city, street, or postal code." });
//   }

//   // Preprocess street address
//   street = preprocessAddress(street);

//   try {
//     // First attempt: Full street-level query
//     const geocodeResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
//       params: {
//         format: "json",
//         country,
//         city,
//         street,
//         postalcode: postalCode,
//         limit: 1,
//       },
//     });

//     console.log("Geocode API Response:", geocodeResponse.data);

//     // Check if a valid response is received
//     if (geocodeResponse.data.length === 0) {
//       console.log("Detailed address not found, trying a broader query...");

//       // Fallback: Broader query using postal code, city, and country
//       const geocodeFallbackResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
//         params: {
//           format: "json",
//           q: `${postalCode}, ${city}, ${country}`,
//           limit: 1,
//         },
//       });

//       if (geocodeFallbackResponse.data.length === 0) {
//         return res.status(400).json({ valid: false, message: "Address not found even after fallback." });
//       }

//       return res.json({
//         valid: true,
//         location: geocodeFallbackResponse.data[0],
//         message: "Address partially matched using broader search.",
//       });
//     }

//     const location = geocodeResponse.data[0];

//     // Validate street (if road is available)
//     if (location.address.road && !street.toLowerCase().includes(location.address.road.toLowerCase())) {
//       return res.status(400).json({
//         valid: false,
//         message: `Street mismatch: expected '${street}', found '${location.address.road}'`,
//       });
//     }

//     // Validate postal code
//     if (location.address.postcode && location.address.postcode !== postalCode) {
//       return res.status(400).json({
//         valid: false,
//         message: `Postal code mismatch: expected '${postalCode}', found '${location.address.postcode}'`,
//       });
//     }

//     return res.json({ valid: true, location });

//   } catch (error) {
//     console.error("Error validating address:", error.message);
//     return res.status(500).json({ valid: false, message: "Error validating address." });
//   }
// };

// module.exports = { validateAddress };

const axios = require("axios");

const extractKeyStreetPart = (street) => {
  // This regex aims to find the last part of the address, ignoring house numbers
  const match = street.match(/(?:[A-Za-z0-9]+(?:\s?[A-Za-z0-9]+)*)$/); // Matches 'Anna Nagar' or '18th Avenue'
  return match ? match[0].trim() : street;
};



const validateAddress = async (req, res) => {
  let { country, state, city, street, postalCode } = req.body;

  if (!country || !state || !city || !street || !postalCode) {
    return res.status(400).json({
      valid: false,
      message: "Missing required fields: country, state, city, street, or postal code.",
    });
  }

  // Extract key street part
  const keyStreet = extractKeyStreetPart(street);
  console.log(`Key street part extracted: ${keyStreet}`);

  try {
    // Step 1: Validate city, state, and country
    const locationQuery = `${city}, ${state}, ${country}`;
    console.log(`Validating location with query: ${locationQuery}`);

    const locationResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: "json",
        q: locationQuery,
        limit: 1,
      },
    });

    if (locationResponse.data.length === 0) {
      return res.status(400).json({
        valid: false,
        message: "The provided city, state, or country is invalid. Please check the details.",
      });
    }

    const resolvedCity = locationResponse.data[0]?.display_name?.includes(city);
    if (!resolvedCity) {
      return res.status(400).json({
        valid: false,
        message: `City '${city}' not found in location response.`,
      });
    }

    // Step 2: Validate partial street address
    const streetQuery = `${keyStreet}, ${city}`;

    console.log(`Validating street with query: ${streetQuery}`);

    const streetResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: "json",
        q: streetQuery,
        limit: 1,
      },
    });

    if (streetResponse.data.length === 0) {
      return res.status(400).json({
        valid: false,
        message: `Street '${keyStreet}' not found within the specified location.`,
      });
    }
    console.log(req.body);

    // Validation successful
    return res.json({
      valid: true,
      location: streetResponse.data[0],
      message: "Address validated successfully.",
    });

  } catch (error) {
    console.error("Error validating address:", error.message);
    return res.status(500).json({
      valid: false,
      message: "Error validating address. Please try again later.",
    });
  }
};

module.exports = { validateAddress };
