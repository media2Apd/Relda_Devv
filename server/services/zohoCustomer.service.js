// const axios = require("axios");
// const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
// const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service");

// const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

// async function zohoRequest(config) {
//   try {
//     return await axios(config);
//   } catch (err) {
//     if (err.response?.status === 401) {
//       const newToken = await refreshZohoAccessToken();
//       setAccessToken(newToken);
//       config.headers = getZohoHeaders();
//       return await axios(config);
//     }
//     throw err;
//   }
// }

// /**
//  * Validates whether a contact ID actually exists and is accessible in current Zoho Org
//  */
// exports.getZohoCustomerById = async (contactId) => {
//   if (!contactId) return null;
//   try {
//     const res = await zohoRequest({
//       method: "GET",
//       url: `${ZOHO_BASE}/contacts/${contactId}`,
//       headers: getZohoHeaders()
//     });
//     return res.data?.contact || null;
//   } catch (err) {
//     // 404 or Zoho 1002: Contact deleted, inaccessible or from different org
//     if (err.response?.status === 404 || err.response?.data?.code === 1002) {
//       console.warn(`⚠️ Zoho contact ID ${contactId} is invalid/inaccessible in this org.`);
//       return null;
//     }
//     throw err;
//   }
// };

// /**
//  * Comprehensive search across GST, Email, and Name
//  */
// exports.searchZohoCustomer = async ({ email, gstin, name }) => {
//   try {
//     // 1. By GSTIN
//     if (gstin) {
//       const res = await zohoRequest({
//         method: "GET",
//         url: `${ZOHO_BASE}/contacts`,
//         params: { gst_no: gstin },
//         headers: getZohoHeaders()
//       });
//       if (res.data?.contacts?.length > 0) {
//         return res.data.contacts[0];
//       }
//     }

//     // 2. By Email
//     if (email) {
//       const res = await zohoRequest({
//         method: "GET",
//         url: `${ZOHO_BASE}/contacts`,
//         params: { email: email.trim() },
//         headers: getZohoHeaders()
//       });
//       if (res.data?.contacts?.length > 0) {
//         return res.data.contacts[0];
//       }
//     }

//     // 3. By Contact Name (Resolves code 3062)
//     if (name) {
//       const res = await zohoRequest({
//         method: "GET",
//         url: `${ZOHO_BASE}/contacts`,
//         params: { search_text: name.trim() },
//         headers: getZohoHeaders()
//       });

//       const contacts = res.data?.contacts || [];
//       const exactMatch = contacts.find(
//         (c) => c.contact_name?.trim().toLowerCase() === name.trim().toLowerCase()
//       );
//       if (exactMatch) return exactMatch;
//       if (contacts.length > 0) return contacts[0];
//     }

//     return null;
//   } catch (err) {
//     console.error("Zoho search failed:", err.response?.data || err.message);
//     return null;
//   }
// };

// /**
//  * Creates customer with automatic fallback if name collision occurs
//  */
// exports.createZohoCustomer = async ({
//   name,
//   email,
//   mobile,
//   address = {},
//   isBusiness = false,
//   gstin,
//   companyName
// }) => {
//   const buildPayload = (contactName) => {
//     const payload = {
//       contact_name: contactName,
//       contact_type: "customer",
//       phone: mobile || "",
//       email: email || "",
//       gst_treatment: isBusiness && gstin ? "business_gst" : "consumer",
//       billing_address: {
//         address: address.address || address.street || "",
//         city: address.city || "",
//         state: address.state || "",
//         zip: address.zip || address.pinCode || "",
//         country: "India"
//       },
//       shipping_address: {
//         address: address.address || address.street || "",
//         city: address.city || "",
//         state: address.state || "",
//         zip: address.zip || address.pinCode || "",
//         country: "India"
//       }
//     };

//     if (isBusiness && gstin) {
//       payload.gst_no = gstin;
//       payload.company_name = companyName || contactName;
//     }
//     return payload;
//   };

//   try {
//     const res = await zohoRequest({
//       method: "POST",
//       url: `${ZOHO_BASE}/contacts`,
//       data: buildPayload(name),
//       headers: getZohoHeaders()
//     });
//     return res.data.contact;
//   } catch (err) {
//     // If contact name already exists (Zoho code 3062)
//     if (err.response?.data?.code === 3062) {
//       console.warn(`⚠️ Contact "${name}" already exists in Zoho. Searching to reuse it...`);
//       const existing = await exports.searchZohoCustomer({ name });
//       if (existing) {
//         return existing;
//       }

//       // If search didn't return it, create with unique mobile/timestamp suffix
//       const uniqueSuffix = mobile ? ` (${mobile.slice(-4)})` : ` (${Date.now().toString().slice(-4)})`;
//       const fallbackName = `${name}${uniqueSuffix}`;
//       console.log(`Creating contact with unique name: ${fallbackName}`);

//       const retryRes = await zohoRequest({
//         method: "POST",
//         url: `${ZOHO_BASE}/contacts`,
//         data: buildPayload(fallbackName),
//         headers: getZohoHeaders()
//       });
//       return retryRes.data.contact;
//     }
//     throw err;
//   }
// };

// exports.updateZohoCustomer = async (contactId, data) => {
//   try {
//     const payload = {
//       contact_name: data.name,
//       phone: data.mobile,
//       email: data.email,
//       gst_treatment: data.isBusiness ? "business_gst" : "consumer",
//       billing_address: {
//         address: data.address?.address || data.address?.street || "",
//         city: data.address?.city || "",
//         state: data.address?.state || "",
//         zip: data.address?.zip || data.address?.pinCode || "",
//         country: "India"
//       },
//       shipping_address: {
//         address: data.address?.address || data.address?.street || "",
//         city: data.address?.city || "",
//         state: data.address?.state || "",
//         zip: data.address?.zip || data.address?.pinCode || "",
//         country: "India"
//       }
//     };

//     if (data.isBusiness && data.gstin) {
//       payload.gst_no = data.gstin;
//       payload.company_name = data.companyName || data.name;
//     }

//     const res = await zohoRequest({
//       method: "PUT",
//       url: `${ZOHO_BASE}/contacts/${contactId}`,
//       data: payload,
//       headers: getZohoHeaders()
//     });

//     return res.data.contact;
//   } catch (err) {
//     console.warn(`Could not update contact ${contactId}:`, err.response?.data?.message || err.message);
//     return null;
//   }
// };
const axios = require("axios");
const { getZohoHeaders, setAccessToken } = require("../config/zohoHeaders");
const { refreshZohoAccessToken } = require("./zohoTokenRefresh.service");

const ZOHO_BASE = "https://www.zohoapis.in/inventory/v1";

async function zohoRequest(config) {
  try {
    return await axios(config);
  } catch (err) {
    if (err.response?.status === 401) {
      const newToken = await refreshZohoAccessToken();
      setAccessToken(newToken);
      config.headers = getZohoHeaders();
      return await axios(config);
    }
    throw err;
  }
}

exports.getZohoCustomerById = async (contactId) => {
  if (!contactId) return null;
  try {
    const res = await zohoRequest({
      method: "GET",
      url: `${ZOHO_BASE}/contacts/${contactId}`,
      headers: getZohoHeaders()
    });
    return res.data?.contact || null;
  } catch (err) {
    if (err.response?.status === 404 || err.response?.data?.code === 1002) {
      console.warn(`⚠️ Zoho contact ID ${contactId} is invalid/inaccessible in this org.`);
      return null;
    }
    throw err;
  }
};

exports.searchZohoCustomer = async ({ email, gstin, name, phone }) => {
  try {
    // 1. By GSTIN
    if (gstin && gstin.trim().length > 5) {
      const res = await zohoRequest({
        method: "GET",
        url: `${ZOHO_BASE}/contacts`,
        params: { gst_no: gstin.trim() },
        headers: getZohoHeaders()
      });
      if (res.data?.contacts?.length > 0) {
        return res.data.contacts[0];
      }
    }

    // 2. By Email
    if (email && email.trim().length > 3) {
      const res = await zohoRequest({
        method: "GET",
        url: `${ZOHO_BASE}/contacts`,
        params: { email: email.trim().toLowerCase() },
        headers: getZohoHeaders()
      });
      if (res.data?.contacts?.length > 0) {
        return res.data.contacts[0];
      }
    }

    // 3. By Mobile / Phone
    const cleanPhone = (phone || "").replace(/[^0-9]/g, "").slice(-10);
    if (cleanPhone && cleanPhone.length === 10) {
      const res = await zohoRequest({
        method: "GET",
        url: `${ZOHO_BASE}/contacts`,
        params: { phone: cleanPhone },
        headers: getZohoHeaders()
      });
      if (res.data?.contacts?.length > 0) {
        return res.data.contacts[0];
      }
    }

    return null;
  } catch (err) {
    console.error("Zoho search failed:", err.response?.data || err.message);
    return null;
  }
};

exports.createZohoCustomer = async ({
  name,
  email,
  mobile,
  address = {},
  isBusiness = false,
  gstin,
  companyName
}) => {
  const cleanMobile = (mobile || "").replace(/[^0-9]/g, "").slice(-10);
  const cleanEmail = (email || "").trim().toLowerCase();

  const buildPayload = (contactName) => {
    const payload = {
      contact_name: contactName,
      company_name: companyName || (isBusiness ? contactName : ""),
      contact_type: "customer",
      customer_sub_type: isBusiness ? "business" : "individual",
      email: cleanEmail,
      phone: cleanMobile,
      mobile: cleanMobile,
      gst_treatment: isBusiness && gstin ? "business_gst" : "consumer",
      billing_address: {
        address: address.address || address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || address.pinCode || "",
        country: "India"
      },
      shipping_address: {
        address: address.address || address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || address.pinCode || "",
        country: "India"
      },
      contact_persons: [
        {
          first_name: contactName,
          email: cleanEmail,
          phone: cleanMobile,
          mobile: cleanMobile
        }
      ]
    };

    if (isBusiness && gstin) {
      payload.gst_no = gstin;
    }
    return payload;
  };

  try {
    const res = await zohoRequest({
      method: "POST",
      url: `${ZOHO_BASE}/contacts`,
      data: buildPayload(name),
      headers: getZohoHeaders()
    });
    return res.data.contact;
  } catch (err) {
    if (err.response?.data?.code === 3062) {
      console.warn(`⚠️ Contact "${name}" already exists in Zoho.`);
      const uniqueSuffix = cleanMobile ? ` (${cleanMobile.slice(-4)})` : ` (${Date.now().toString().slice(-4)})`;
      const fallbackName = `${name}${uniqueSuffix}`;

      const retryRes = await zohoRequest({
        method: "POST",
        url: `${ZOHO_BASE}/contacts`,
        data: buildPayload(fallbackName),
        headers: getZohoHeaders()
      });
      return retryRes.data.contact;
    }
    throw err;
  }
};

/**
 * 🔥 UPDATES EXISTING CUSTOMER AND SETS PRIMARY CONTACT PERSON (WITHOUT CODE 8 ERROR)
 */
exports.updateZohoCustomer = async (contactId, data) => {
  try {
    const cleanMobile = (data.mobile || "").replace(/[^0-9]/g, "").slice(-10);
    const cleanEmail = (data.email || "").trim().toLowerCase();

    console.log(`📝 Updating Zoho Contact ${contactId} with Email: "${cleanEmail}", Mobile: "${cleanMobile}"`);

    // 1️⃣ Update Root Contact Record
    const payload = {
      contact_name: data.name,
      company_name: data.companyName || (data.isBusiness ? data.name : ""),
      email: cleanEmail,
      phone: cleanMobile,
      mobile: cleanMobile,
      gst_treatment: data.isBusiness && data.gstin ? "business_gst" : "consumer",
      billing_address: {
        address: data.address?.address || data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zip: data.address?.zip || data.address?.pinCode || "",
        country: "India"
      },
      shipping_address: {
        address: data.address?.address || data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zip: data.address?.zip || data.address?.pinCode || "",
        country: "India"
      }
    };

    if (data.isBusiness && data.gstin) {
      payload.gst_no = data.gstin;
    }

    await zohoRequest({
      method: "PUT",
      url: `${ZOHO_BASE}/contacts/${contactId}`,
      data: payload,
      headers: getZohoHeaders()
    });

    // 2️⃣ Fetch Full Contact to check Contact Persons
    const contactRes = await zohoRequest({
      method: "GET",
      url: `${ZOHO_BASE}/contacts/${contactId}`,
      headers: getZohoHeaders()
    });

    const contact = contactRes.data?.contact;
    const contactPersons = contact?.contact_persons || [];
    const primaryCp = contactPersons.find((cp) => cp.is_primary_contact) || contactPersons[0];

    // 👉 FIX: Intha payload-la `is_primary_contact` koodadhu! (Code 8 error solve aagum)
    const cpData = {
      contact_id: contactId,
      first_name: data.name,
      email: cleanEmail,
      phone: cleanMobile,
      mobile: cleanMobile
    };

    let targetPersonId = null;

    if (primaryCp && primaryCp.contact_person_id) {
      console.log(`🔄 Updating existing contact person ${primaryCp.contact_person_id}...`);
      await zohoRequest({
        method: "PUT",
        url: `${ZOHO_BASE}/contacts/contactpersons/${primaryCp.contact_person_id}`,
        data: cpData,
        headers: getZohoHeaders()
      });
      targetPersonId = primaryCp.contact_person_id;
    } else {
      console.log(`🆕 Creating new contact person for contact ${contactId}...`);
      const createCpRes = await zohoRequest({
        method: "POST",
        url: `${ZOHO_BASE}/contacts/contactpersons`,
        data: cpData,
        headers: getZohoHeaders()
      });
      targetPersonId = createCpRes.data?.contact_person?.contact_person_id;
    }

    // 🔥 Mark as primary using dedicated endpoint
    if (targetPersonId) {
      await zohoRequest({
        method: "POST",
        url: `${ZOHO_BASE}/contacts/contactpersons/${targetPersonId}/primary`,
        headers: getZohoHeaders()
      }).catch(() => {});
      console.log(`✅ Contact Person ${targetPersonId} marked as PRIMARY!`);
    }

    return contact;
  } catch (err) {
    console.error(`❌ Failed to update Zoho Contact ${contactId}:`, err.response?.data || err.message);
    return null;
  }
};