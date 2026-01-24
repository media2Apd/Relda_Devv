// const {
//   createZohoCustomer,
//   updateZohoCustomer
// } = require("../services/zohoCustomer.service");

// /**
//  * Always return a Zoho customer_id
//  * - Create if missing
//  * - Update if exists
//  */
// exports.ensureZohoCustomer = async (user) => {

//   if (!user.email) {
//     throw new Error("Customer email required for Zoho Sales Order");
//   }

//   if (!user.zohoCustomerId) {
//     const zohoCustomer = await createZohoCustomer(user);
//     user.zohoCustomerId = zohoCustomer.contact_id;
//     await user.save();

//     console.log("✅ Zoho customer CREATED:", zohoCustomer.contact_id);
//   } else {
//     await updateZohoCustomer(user.zohoCustomerId, user);
//     console.log("🔄 Zoho customer UPDATED:", user.zohoCustomerId);
//   }

//   return user.zohoCustomerId;
// };
// const {
//   createZohoCustomerFromOrder,
//   createZohoCustomer
// } = require("../services/zohoCustomer.service");

// /**
//  * FINAL BUSINESS LOGIC
//  */
// exports.ensureZohoCustomerForOrder = async ({
//   order,
//   customerUser,
//   reqUser
// }) => {

//   /* ========== MANAGESALES FLOW (FORCE CREATE) ========== */
//   if (reqUser?.role === "MANAGESALES") {

//     if (!order.billing_email) {
//       throw new Error("Billing email missing for MANAGESALES order");
//     }

//     // 🔥 ALWAYS CREATE NEW CUSTOMER
//     const created = await createZohoCustomerFromOrder(order);

//     console.log(
//       "👤 Zoho customer FORCE-CREATED for MANAGESALES:",
//       created.contact_id,
//       "| Email:",
//       order.billing_email
//     );

//     return created.contact_id;
//   }

//   /* ========== NORMAL CUSTOMER FLOW ========== */
//   if (!customerUser.zohoCustomerId) {
//     const zohoCustomer = await createZohoCustomer(customerUser);
//     customerUser.zohoCustomerId = zohoCustomer.contact_id;
//     await customerUser.save();
//   }

//   return customerUser.zohoCustomerId;
// };
const {
  searchZohoCustomerByEmail,
  createZohoCustomerFromOrder,
  createZohoCustomer
} = require("../services/zohoCustomer.service");

exports.ensureZohoCustomerForOrder = async (order) => {

  if (!order) {
    throw new Error("Order missing");
  }

  /* ================= BUILD CUSTOMER SNAPSHOT ================= */
  const customer = {
    name: order.billing_name,
    email: order.billing_email,
    mobile: order.billing_tel,
    address: parseAddress(order.billing_address)
  };

  if (!order.email) {
    throw new Error("Order customer email missing");
  }

  // 🔥 If already mapped → reuse
  if (order.zohoCustomerId) {
    console.log("✅ Using existing Zoho customer:", order.zohoCustomerId);
    return order.zohoCustomerId;
  }

  // 🔥 Create Zoho customer
  const zohoCustomer = await createZohoCustomer(customer);

  // 🔥 Save mapping in order itself
  order.zohoCustomerId = zohoCustomer.contact_id;
  await order.save();

  console.log("🆕 Zoho customer created for order:", zohoCustomer.contact_id);

  return zohoCustomer.contact_id;
};

/* ================= ADDRESS PARSER ================= */
function parseAddress(addressString = "") {
  // "ganapathy nagar, aranthangi, Aranthangi, Tamilnadu, 614616, India"
  const parts = addressString.split(",").map(p => p.trim());

  return {
    street: parts[0] || "",
    city: parts[2] || parts[1] || "",
    state: parts[3] || "",
    pinCode: parts[4] || "",
    country: parts[5] || "India"
  };
}



