// require("dotenv").config();
// const axios = require("axios");

// let ACCESS_TOKEN = null;

// async function refreshAccessToken() {
//   const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

//   try {
//     const res = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
//       params: {
//         refresh_token: REFRESH_TOKEN,
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         grant_type: "refresh_token"
//       }
//     });

//     ACCESS_TOKEN = res.data.access_token;
//     console.log("✅ Zoho access token refreshed");
//     return ACCESS_TOKEN;
//   } catch (err) {
//     console.error("❌ Token refresh failed:", err.response?.data || err.message);
//     throw new Error("Token refresh failed. Please regenerate tokens.");
//   }
// }

// async function sendToZoho(module, payload) {
//   try {
//     if (!ACCESS_TOKEN) {
//       await refreshAccessToken();
//     }

//     const res = await axios.post(`https://www.zohoapis.in/crm/v2/${module}`, {
//       data: [payload],
//     }, {
//       headers: {
//         Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//       }
//     });

//     return res.data;
//   } catch (err) {
//     if (err.response?.status === 401) {
//       console.warn("🔁 Token expired. Refreshing and retrying...");
//       await refreshAccessToken();

//       // Retry once after refreshing
//       const retry = await axios.post(`https://www.zohoapis.in/crm/v2/${module}`, {
//         data: [payload],
//       }, {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//         }
//       });

//       return retry.data;
//     }

//     console.error("⚠️ Zoho CRM Sync Failed:", err.response?.data || err.message);
//     throw new Error(err.message);
//   }
// }

// module.exports = { sendToZoho };
// const FormData = require('form-data');
// const fs = require('fs');
// const { default: axios } = require('axios');

// require("dotenv").config();
// let ACCESS_TOKEN = null;

// async function refreshAccessToken() {
//   const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

//   try {
//     const res = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
//       params: {
//         refresh_token: REFRESH_TOKEN,
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         grant_type: "refresh_token"
//       }
//     });

//     ACCESS_TOKEN = res.data.access_token;
//     console.log("✅ Zoho access token refreshed");
//     return ACCESS_TOKEN;
//   } catch (err) {
//     console.error("❌ Token refresh failed:", err.response?.data || err.message);
//     throw new Error("Token refresh failed. Please regenerate tokens.");
//   }
// }

// async function sendToZoho(module, payload) {
//   try {
//     if (!ACCESS_TOKEN) {
//       await refreshAccessToken();
//     }

//     const res = await axios.post(`https://www.zohoapis.in/crm/v2/${module}`, {
//       data: [payload],
//     }, {
//       headers: {
//         Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//       }
//     });

//     return res.data;
//   } catch (err) {
//     if (err.response?.status === 401) {
//       console.warn("🔁 Token expired. Refreshing and retrying...");
//       await refreshAccessToken();

//       // Retry once after refreshing
//       const retry = await axios.post(`https://www.zohoapis.in/crm/v2/${module}`, {
//         data: [payload],
//       }, {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//         }
//       });

//       return retry.data;
//     }

//     console.error("⚠️ Zoho CRM Sync Failed:", err.response?.data || err.message);
//     throw new Error(err.message);
//   }
// }

// async function attachFileToZohoRecord(module, recordId, fileUrl, filename) {
//   try {
//     if (!ACCESS_TOKEN) {
//       await refreshAccessToken();
//     }

//     // Step 1: Download file from Cloudinary
//     const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
//     const fileBuffer = Buffer.from(fileResponse.data);

//     // Step 2: Create form-data
//     const form = new FormData();
//     form.append('file', fileBuffer, filename);

//     // Step 3: Send attachment to Zoho
//     const res = await axios.post(
//       `https://www.zohoapis.in/crm/v2/${module}/${recordId}/Attachments`,
//       form,
//       {
//         headers: {
//           Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//           ...form.getHeaders(),
//         },
//       }
//     );

//     console.log("📎 File attached to Zoho:", res.data);
//     return res.data;
//   } catch (err) {
//     console.error("❌ Failed to attach file to Zoho:", err.response?.data || err.message);
//     throw err;
//   }
// }

// module.exports = {
//   sendToZoho,
//   attachFileToZohoRecord
// };
const FormData = require('form-data');
const { default: axios } = require('axios');

require("dotenv").config();
let ACCESS_TOKEN = null;

async function refreshAccessToken() {
  const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

  try {
    const res = await axios.post("https://accounts.zoho.in/oauth/v2/token", null, {
      params: {
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "refresh_token"
      }
    });

    ACCESS_TOKEN = res.data.access_token;
    console.log("✅ Zoho access token refreshed");
    return ACCESS_TOKEN;
  } catch (err) {
    console.error("❌ Token refresh failed:", err.response?.data || err.message);
    throw new Error("Token refresh failed. Please regenerate tokens.");
  }
}

async function sendToZoho(module, payload) {
  try {
    if (!ACCESS_TOKEN) {
      await refreshAccessToken();
    }

    const res = await axios.post(`https://www.zohoapis.in/crm/v2/${module}`, {
      data: [payload],
    }, {
      headers: {
        Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
      }
    });

    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn("🔁 Token expired. Refreshing and retrying...");
      await refreshAccessToken();

      // Retry once after refreshing
      const retry = await axios.post(`https://www.zohoapis.in/crm/v2/${module}`, {
        data: [payload],
      }, {
        headers: {
          Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
        }
      });

      return retry.data;
    }

    console.error("⚠️ Zoho CRM Sync Failed:", err.response?.data || err.message);
    throw new Error(err.message);
  }
}

// Upload main product image (photo) to Zoho record


async function uploadImageToField(module, recordId, fileUrl, fieldName = "Record_Image") {
  try {
    if (!ACCESS_TOKEN) {
      await refreshAccessToken();
    }

    // Download image from Cloudinary URL
    const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(fileResponse.data);
    const fileName = fileUrl.split("/").pop().split("?")[0] || "image.jpg";

    // Create form-data with file
    const form = new FormData();
    form.append('file', fileBuffer, fileName);

    // Upload image to Zoho photo endpoint
    const res = await axios.post(
      `https://www.zohoapis.in/crm/v2/${module}/${recordId}/photo`,
      form,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
          ...form.getHeaders(),
        }
      }
    );

    console.log(`🖼️ Image uploaded to Zoho field '${fieldName}':`, res.data);
    return res.data;

  } catch (err) {
    console.error("❌ Failed to upload image to Zoho field:", err.response?.data || err.message);
    throw err;
  }
}

// Attach any file (pdf, doc, image, etc.) to Zoho CRM record attachments
async function attachFileToZohoRecord(module, recordId, fileUrl, filename) {
  try {
    if (!ACCESS_TOKEN) {
      await refreshAccessToken();
    }

    // Download file from URL
    const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(fileResponse.data);

    // Create form-data for file
    const form = new FormData();
    form.append('file', fileBuffer, filename);

    // Upload attachment to Zoho CRM record
    const res = await axios.post(
      `https://www.zohoapis.in/crm/v2/${module}/${recordId}/Attachments`,
      form,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
          ...form.getHeaders(),
        }
      }
    );

    console.log("📎 File attached to Zoho record:", res.data);
    return res.data;

  } catch (err) {
    console.error("❌ Failed to attach file to Zoho record:", err.response?.data || err.message);
    throw err;
  }
}

async function updateZohoRecord(module, recordId, payload) {
  try {
    if (!ACCESS_TOKEN) {
      await refreshAccessToken();
    }

    const response = await axios.put(
      `https://www.zohoapis.in/crm/v2/${module}`,
      {
        data: [{ id: recordId, ...payload }],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn("🔁 Token expired. Refreshing and retrying...");
      await refreshAccessToken();

      const retry = await axios.put(
        `https://www.zohoapis.in/crm/v2/${module}`,
        {
          data: [{ id: recordId, ...payload }],
        },
        {
          headers: {
            Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
          },
        }
      );

      return retry.data;
    }

    console.error("❌ Zoho CRM update failed:", err.response?.data || err.message);
    throw err;
  }
}
// Helper: make authenticated request with retry on 401
async function zohoRequest(config) {
  if (!ACCESS_TOKEN) await refreshAccessToken();

  try {
    config.headers = config.headers || {};
    config.headers.Authorization = `Zoho-oauthtoken ${ACCESS_TOKEN}`;
    return await axios(config);
  } catch (err) {
    if (err.response?.status === 401) {
      console.warn("🔁 Token expired. Refreshing and retrying...");
      await refreshAccessToken();
      config.headers.Authorization = `Zoho-oauthtoken ${ACCESS_TOKEN}`;
      return await axios(config);
    }
    throw err;
  }
}
// Get Lead by ID
async function getLeadById(leadId) {
  try {
    const res = await zohoRequest({
      method: "get",
      url: `https://www.zohoapis.in/crm/v2/Leads/${leadId}`,
    });
    return res.data?.data?.[0] || null;
  } catch (err) {
    console.error("❌ Failed to fetch lead:", err.response?.data || err.message);
    return null;
  }
}

// Search in Zoho module by keyword
async function searchInZoho(module, keyword) {
  try {
    const res = await zohoRequest({
      method: "get",
      url: `https://www.zohoapis.in/crm/v2/${module}/search`,
      params: { word: keyword },
    });
    return res.data?.data || [];
  } catch (err) {
    if (err.response?.data?.code === "NO_CONTENT") return [];
    console.error(`❌ Zoho search failed in ${module}:`, err.response?.data || err.message);
    return [];
  }
}

// Diagnose duplicates before conversion
async function diagnoseDuplicateLeadConversion(leadId) {
  console.log(`🔍 Diagnosing leadId: ${leadId}\n`);

  const lead = await getLeadById(leadId);
  if (!lead) {
    console.log("❌ Lead not found.");
    return { canConvert: false, reason: "Lead not found" };
  }

  console.log("Lead details:", {
    id: lead.id,
    Email: lead.Email,
    Phone: lead.Phone,
    Converted: lead.Converted || "N/A",
  });

  if (lead.Converted) {
    return { canConvert: false, reason: "Lead already converted" };
  }

  let contactsByEmail = [];
  if (lead.Email) {
    contactsByEmail = await searchInZoho("Contacts", lead.Email);
  }

  let contactsByPhone = [];
  if (contactsByEmail.length === 0 && lead.Phone) {
    contactsByPhone = await searchInZoho("Contacts", lead.Phone);
  }

  if (contactsByEmail.length > 0 || contactsByPhone.length > 0) {
    console.log("⚠️ Duplicate contacts found, conversion may fail.");
    return {
      canConvert: false,
      reason: "Duplicate contacts found",
      contactsByEmail,
      contactsByPhone,
    };
  }

  console.log("✅ No duplicates detected, safe to convert.");
  return { canConvert: true, lead };
}

// Convert Lead safely
async function convertLead(leadId, dealData = {}) {
  const diagnosis = await diagnoseDuplicateLeadConversion(leadId);

  if (!diagnosis.canConvert) {
    console.log("⛔ Conversion aborted:", diagnosis.reason);
    return {
      success: false,
      message: diagnosis.reason,
      code: "DUPLICATE_DATA", // <-- ADD THIS
      details: diagnosis,
    };
  }

  try {
    const payload = {
      data: [
        {
          overwrite: true,
          notify_lead_owner: true,
          notify_new_entity_owner: true,
          Deals: dealData,
        },
      ],
    };

    const res = await zohoRequest({
      method: "post",
      url: `https://www.zohoapis.in/crm/v2/Leads/${leadId}/actions/convert`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = res.data?.data?.[0];

    if (resData?.status === "error" && resData.code === "DUPLICATE_DATA") {
      return {
        success: false,
        message: "DUPLICATE_LEAD_CONVERSION",
        code: "DUPLICATE_DATA", // <-- RETURN CODE
        details: resData,
      };
    }

    return { success: true, data: resData };
  } catch (err) {
    console.error("❌ Lead conversion failed:", err.response?.data || err.message);
    return {
      success: false,
      message: err.message,
      code: err?.response?.data?.data?.[0]?.code || "UNKNOWN",
      error: err.response?.data || err,
    };
  }
}





async function findZohoContactOrAccount({ email, phone }) {
  let contactId = null;
  let accountId = null;

  if (email) {
    const contacts = await searchInZoho("Contacts", email);
    if (contacts?.length) {
      contactId = contacts[0].id;
      accountId = contacts[0].Account_Name?.id;
    }
  }

  if (!contactId && phone) {
    const contacts = await searchInZoho("Contacts", phone);
    if (contacts?.length) {
      contactId = contacts[0].id;
      accountId = contacts[0].Account_Name?.id;
    }
  }

  if (!contactId && !accountId) {
    console.warn("⚠️ No matching Contact/Account found for email/phone.");
  }

  return { contactId, accountId };
}

// Delete Zoho record
async function deleteZohoRecord(module, recordId) {
  try {
    const res = await zohoRequest({
      method: 'delete',
      url: `https://www.zohoapis.in/crm/v2/${module}/${recordId}`
    });

    console.log(`🗑️ Deleted ${module} record: ${recordId}`);
    return res.data;
  } catch (err) {
    console.error(`❌ Failed to delete ${module} record:`, err.response?.data || err.message);
    throw err;
  }
}

// Updated convertLead with auto-delete duplicates
async function convertLeadWithAutoDelete(leadId, dealData = {}) {
  const diagnosis = await diagnoseDuplicateLeadConversion(leadId);

  if (!diagnosis.canConvert && diagnosis.reason === "Duplicate contacts found") {
    const duplicates = [
      ...(diagnosis.contactsByEmail || []),
      ...(diagnosis.contactsByPhone || []),
    ];

    // Delete all detected duplicate contacts
    for (const contact of duplicates) {
      try {
        await deleteZohoRecord("Contacts", contact.id);
      } catch (err) {
        return {
          success: false,
          message: `Failed to delete duplicate contact ${contact.id}`,
          error: err,
        };
      }
    }

    console.log("✅ All duplicate contacts deleted. Retrying conversion...");
    return await convertLead(leadId, dealData); // call base conversion logic
  }

  if (!diagnosis.canConvert) {
    console.log("⛔ Conversion aborted:", diagnosis.reason);
    return {
      success: false,
      message: diagnosis.reason,
      code: "CANNOT_CONVERT",
      details: diagnosis,
    };
  }

  return await convertLead(leadId, dealData); // call base conversion logic
}
async function findZohoContacts({ email, phone }) {
  const queryParts = [];
  if (email) queryParts.push(`Email:equals:${email}`);
  if (phone) queryParts.push(`Phone:equals:${phone}`);
  const query = queryParts.join(' or ');

  // Use zohoRequest with GET method and params
  const response = await zohoRequest({
    method: 'get',
    url: 'https://www.zohoapis.in/crm/v2/Contacts/search',
    params: { criteria: query },
  });
  return response?.data?.data || [];
}

async function deleteZohoContact(contactId) {
  try {
    const response = await zohoRequest({
      method: 'delete',
      url: `https://www.zohoapis.in/crm/v2/Contacts/${contactId}`,
    });
    console.log(`🗑️ Deleted Zoho Contact ID: ${contactId}`);
    return response.data;
  } catch (err) {
    console.error(`❌ Failed to delete Zoho Contact ${contactId}:`, err.response?.data || err.message);
    // Log the full error for debugging
    if (err.response) console.error(JSON.stringify(err.response.data, null, 2));
    throw err;
  }
}

async function deleteDuplicateContacts({ email, phone }) {
  const duplicates = await findZohoContacts({ email, phone });
  for (const contact of duplicates) {
    await deleteZohoContact(contact.id);
    console.log(`🗑️ Deleted duplicate contact: ${contact.Full_Name || contact.id}`);
  }
}


// 🔍 Search for a record by email or phone in a Zoho module (e.g., Contacts)
// async function searchInZoho(module, value) {
//   if (!ACCESS_TOKEN) await refreshAccessToken();

//   try {
//     const response = await axios.get(`https://www.zohoapis.in/crm/v2/${module}/search`, {
//       headers: {
//         Authorization: `Zoho-oauthtoken ${ACCESS_TOKEN}`,
//       },
//       params: {
//         word: value, // general search keyword
//       },
//     });

//     return response.data?.data || [];

//   } catch (err) {
//     const code = err?.response?.data?.code;
//     if (code === 'NO_CONTENT') return []; // no matching results
//     console.error(`❌ Zoho search failed in ${module}:`, err.response?.data || err.message);
//     return [];
//   }
// }


module.exports = {
  sendToZoho,
  uploadImageToField,
  attachFileToZohoRecord,
  updateZohoRecord,
  convertLead,
  getLeadById,
  findZohoContactOrAccount,
  searchInZoho,
   diagnoseDuplicateLeadConversion,
   zohoRequest,
   convertLeadWithAutoDelete,
deleteZohoRecord,
findZohoContacts,
deleteZohoContact,
deleteDuplicateContacts,
};
