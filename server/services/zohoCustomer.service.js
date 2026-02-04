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

exports.createZohoCustomer = async (user) => {

  if (!user.email) {
    throw new Error("Email required to create Zoho customer");
  }

  const payload = {
    contact_name: user.name,
  company_name: user.isBusiness ? user.companyName : user.name,
    contact_type: "customer",

    gst_treatment: user.isBusiness
      ? "business_gst"
      : "consumer",

    gst_no: user.isBusiness ? user.gst?.gstin : undefined,

    phone: user.mobile,

    contact_persons: [
      {
        first_name: user.name,
        email: user.email,
        phone: user.mobile,
        is_primary_contact: true
      }
    ],
    

    billing_address: {
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.pinCode || "",
      country: user.address?.country || "India"
    },

    shipping_address: {
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.pinCode || "",
      country: user.address?.country || "India"
    }
  };

  const response = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/contacts`,
    headers: {
      ...getZohoHeaders(),
      "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID
    },
    data: payload
  });

  return response.data.contact;
};


exports.updateZohoCustomer = async (zohoContactId, user) => {

  if (!user.email) {
    console.log("⚠️ Email missing, skipping Zoho email update");
  }

  const payload = {
    contact_name: user.name,
    phone: user.mobile,
     company_name: user.isBusiness ? user.companyName : user.name,
    contact_type: "customer",

    gst_treatment: user.isBusiness
      ? "business_gst"
      : "consumer",

    gst_no: user.isBusiness ? user.gst?.gstin : undefined,

    contact_persons: [
      {
        email: user.email,
        phone: user.mobile,
        is_primary_contact: true
      }
    ],

    billing_address: {
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.pinCode || "",
      country: user.address?.country || "India"
    },

    shipping_address: {
      address: user.address?.street || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
      zip: user.address?.pinCode || "",
      country: user.address?.country || "India"
    }
  };

  const response = await zohoRequest({
    method: "PUT",
    url: `${ZOHO_BASE}/contacts/${zohoContactId}`,
    headers: {
      ...getZohoHeaders(),
      "X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID
    },
    data: payload
  });

  return response.data.contact;
};

// exports.searchZohoCustomerByEmail = async (email) => {
//   const res = await zohoRequest({
//     method: "GET",
//     url: `${ZOHO_BASE}/contacts?email=${encodeURIComponent(email)}`
//   });

//   return res.data.contacts?.[0] || null;
// };

// exports.createZohoCustomerFromOrder = async (order) => {
//   const payload = {
//     contact_name: order.billing_name || "Customer",
//     contact_type: "customer",
//     contact_persons: [
//       {
//         first_name: order.billing_name || "Customer",
//         email: order.billing_email,
//         phone: order.billing_tel,
//         is_primary_contact: true
//       }
//     ],
//     billing_address: {
//       address: order.billing_address,
//       country: "India"
//     },
//     shipping_address: {
//       address: order.shipping_address,
//       country: "India"
//     }
//   };

//   const res = await zohoRequest({
//     method: "POST",
//     url: `${ZOHO_BASE}/contacts`,
//     data: payload
//   });

//   return res.data.contact;
// };


/* 🔍 search by email */
exports.searchZohoCustomerByEmail = async (email) => {
  let page = 1;

  while (true) {
    const res = await zohoRequest({
      method: "GET",
      url: `${ZOHO_BASE}/contacts`,
      params: {
        page,
        per_page: 200
      }
    });

    const contacts = res.data?.contacts || [];

    for (const contact of contacts) {
      const persons = contact.contact_persons || [];

      const match = persons.find(
        p => p.email?.toLowerCase() === email.toLowerCase()
      );

      if (match) {
        return contact;
      }
    }

    if (!res.data?.page_context?.has_more_page) {
      break;
    }

    page++;
  }

  return null;
};
// services/zohoCustomer.service.js
exports.searchZohoCustomer = async ({ email, gstin }) => {

  // Priority 1: GSTIN
  if (gstin) {
    const res = await zohoRequest({
      method: "GET",
      url: `${ZOHO_BASE}/contacts?gst_no=${gstin}`,
      headers: getZohoHeaders()
    });

    if (res.data.contacts?.length) {
      return res.data.contacts[0];
    }
  }

  // Priority 2: Email
  if (email) {
    const res = await zohoRequest({
      method: "GET",
      url: `${ZOHO_BASE}/contacts?email=${email}`,
      headers: getZohoHeaders()
    });

    if (res.data.contacts?.length) {
      return res.data.contacts[0];
    }
  }

  return null;
};

exports.updateZohoCustomers = async (contactId, payload) => {
  const res = await zohoRequest({
    method: "PUT",
    url: `${ZOHO_BASE}/contacts/${contactId}`,
    headers: getZohoHeaders(),
    data: payload
  });

  return res.data.contact;
};



/* 🆕 create from ORDER (MANAGESALES) */
exports.createZohoCustomerFromOrder = async (order) => {
  const payload = {
    contact_name: order.billing_name || "Website Customer",
    contact_type: "customer",

    contact_persons: [
      {
        first_name: order.billing_name || "Customer",
        email: order.billing_email,        // 🔥 THIS IS PRIMARY EMAIL
        phone: order.billing_tel,
        is_primary_contact: true
      }
    ],

    billing_address: {
      address: order.billing_address,
      country: "India"
    },

    shipping_address: {
      address: order.shipping_address,
      country: "India"
    }
  };

  console.log("🧾 ZOHO CUSTOMER CREATE PAYLOAD:", payload);

  const res = await zohoRequest({
    method: "POST",
    url: `${ZOHO_BASE}/contacts`,
    data: payload
  });

  if (!res.data?.contact?.contact_id) {
    throw new Error("Zoho customer creation failed");
  }

  return res.data.contact;
};


