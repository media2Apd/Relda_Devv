// /**
//  * Zoho → Website status mapping
//  * We DO NOT create invoice/package here
//  * Only mirror Zoho state
//  */
// exports.mapZohoStatusToLocal = (zohoOrder) => {
//   const { status } = zohoOrder;

//   // 🔴 Delivered
//   if (status === "closed") {
//     return "delivered";
//   }

//   // 🟠 Shipped
//   if (status === "shipped" || status === "partially_shipped") {
//     return "shipped";
//   }

//   // 🟡 Packed (Zoho doesn't expose this clearly)
//   // If you later track packages count, you can enhance this
//   // For now, skip packaged from Zoho sync

//   // 🔵 Ordered
//   if (status === "confirmed") {
//     return "ordered";
//   }

//   // ⚪ Pending
//   if (status === "draft" || status === "sent") {
//     return "pending";
//   }

//   // ❓ Fallback safety
//   return "pending";
// };

// exports.mapZohoStatusToLocal = (zohoOrder) => {
//   const {
//     status,
//     packages_count = 0,
//     shipment_status
//   } = zohoOrder;

//   /**
//    * ZOHO REALITY:
//    * - PACKED = package created
//    * - SHIPPED = status = shipped
//    * - DELIVERED = status = closed
//    */

//   // 🟢 DELIVERED (highest priority)
//   if (status === "closed") {
//     return "delivered";
//   }

//   // 🔵 SHIPPED
//   if (status === "shipped" || status === "partially_shipped") {
//     return "shipped";
//   }

//   // 🟡 PACKAGED (THIS IS YOUR MISSING PIECE 🔥)
//   if (packages_count > 0 && status === "confirmed") {
//     return "packaged";
//   }

//   // 🟠 ORDERED
//   if (status === "confirmed") {
//     return "ordered";
//   }

//   // ⚪ PENDING
//   if (status === "draft" || status === "sent") {
//     return "pending";
//   }

//   // ❓ FALLBACK
//   return "pending";
// };
exports.mapZohoStatusToLocal = (zohoOrder, currentLocalStatus) => {
  const { status } = zohoOrder;

  // 1️⃣ DELIVERED (FINAL)
  if (status === "fulfilled") {
    return "delivered";
  }

  // 2️⃣ SHIPPED
  if (status === "shipped" || status === "partially_shipped") {
    return "shipped";
  }

  // 3️⃣ OTHERWISE — DO NOT TOUCH LOCAL FLOW
  // ordered stays ordered
  // packaged stays packaged
  return currentLocalStatus;
};
