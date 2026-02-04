// const productModel = require("../../models/productModel")
// const { fetchZohoItems } = require("../../services/zohoInventory.service")

// exports.syncZohoVariantsAsProducts = async () => {
//   const items = await fetchZohoItems()
//   console.log("Fetched ZOHO items:", items.length)
//   console.log(items);
  
//   for (const item of items) {

//     // Only variant products
//     if (!item.has_variants || !item.variants) continue

//     for (const variant of item.variants) {
//       await productModel.findOneAndUpdate(
//         { zohoVariantId: variant.item_id }, // 🔑 unique per variant
//         {
//           zohoItemId: item.item_id,          // parent
//           zohoVariantId: variant.item_id,

//           productName: variant.name,
//           parentName: item.name,
//           category: item.category_name || "",

//           attributes: variant.attributes,
//           sellingPrice: variant.rate,
//           availability: variant.available_stock,

//           isHidden: item.status !== "active"
//         },
//         { upsert: true, new: true }
//       )
//     }
//   }

//   console.log("✅ Zoho variants synced as individual products")
// }
const productModel = require("../../models/productModel");
// const { calculateInclusivePrice } = require("../../utils/gst.util");
const { fetchZohoItems } = require("../../services/zohoInventory.service");
const { uploadZohoImageToCloudinary } = require("../../services/zohoImageToCloudinary.service");

// exports.syncZohoVariantsAsProducts = async () => {
//   const items = await fetchZohoItems();

//   console.log("Fetched ZOHO items:", items.length);

//   for (const item of items) {

//     // 🔹 Build attributes
//     const attributes = {};
//     if (item.attribute_name1)
//       attributes[item.attribute_name1] = item.attribute_option_name1;
//     if (item.attribute_name2)
//       attributes[item.attribute_name2] = item.attribute_option_name2;
//     if (item.attribute_name3)
//       attributes[item.attribute_name3] = item.attribute_option_name3;

//     // 🔥 IMAGE HANDLING
//     let productImages = [];

//     if (item.image_document_id) {
//       const cloudinaryImage = await uploadZohoImageToCloudinary(item.item_id);

//       if (cloudinaryImage) {
//         productImages.push({
//           url: cloudinaryImage.url,
//           type: "image"
//         });
//       }
//     }

//     await productModel.findOneAndUpdate(
//       { zohoVariantId: item.item_id },
//       {
//         zohoItemId: item.group_id || item.item_id,
//         zohoVariantId: item.item_id,

//         productName: item.name,
//         parentName: item.group_name || "",
//         brandName: item.brand || "",

//         attributes,
//         price: item.purchase_rate,
//         sellingPrice: item.rate,
//         availability: item.available_stock,

//         productImage: productImages,
//         isHidden: item.status !== "active"
//       },
//       { upsert: true, new: true }
//     );
//   }

//   console.log("✅ Zoho variants + Cloudinary images synced");
// };
const GST_PERCENT = 18;
// exports.syncZohoVariantsAsProducts = async () => {
//   const items = await fetchZohoItems();

//   console.log("Fetched ZOHO items:", items.length);

//   for (const item of items) {

//     // 🔥 FILTER: only Relda category
//     if (item.cf_category !== "Relda") {
//       continue; // skip others
//     }

//     // 🔹 Build attributes
//     const attributes = {};
//     if (item.attribute_name1)
//       attributes[item.attribute_name1] = item.attribute_option_name1;
//     if (item.attribute_name2)
//       attributes[item.attribute_name2] = item.attribute_option_name2;
//     if (item.attribute_name3)
//       attributes[item.attribute_name3] = item.attribute_option_name3;

//     // 🔥 IMAGE HANDLING
//     let productImages = [];

//     if (item.image_document_id) {
//       const cloudinaryImage = await uploadZohoImageToCloudinary(item.item_id);

//       if (cloudinaryImage) {
//         productImages.push({
//           url: cloudinaryImage.url,
//           type: "image"
//         });
//       }
//     }

//     await productModel.findOneAndUpdate(
//       { zohoVariantId: item.item_id },
//       {
//         zohoItemId: item.group_id || item.item_id,
//         zohoVariantId: item.item_id,

//         productName: item.name,
//         parentName: item.group_name || "",
//         brandName: item.brand || "",

//         attributes,
//         price: item.purchase_rate,
//         sellingPrice: item.rate,
//         availability: item.available_stock,

//         productImage: productImages,
//         isHidden: item.status !== "active"
//       },
//       { upsert: true, new: true }
//     );
//   }

//   console.log("✅ Zoho variants (cf_category=Relda) synced");
// };
const {
  resolveGSTFromItem,
  calculateInclusivePrice
} = require("../../services/zohoTaxResolver");

// exports.syncZohoVariantsAsProducts = async () => {
//   try {
//     const items = await fetchZohoItems();
//     console.log("📦 Fetched ZOHO items:", items.length);

//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];

//       /* ======================================================
//          🧪 FULL RAW ITEM DUMP – FIRST ITEM ONLY
//          ====================================================== */
//       if (i === 0) {
//         console.log("🧪🧪🧪 FIRST ZOHO ITEM – FULL RAW OBJECT 🧪🧪🧪");
//         console.log(JSON.stringify(item, null, 2));
//         console.log("🧪🧪🧪 END OF FIRST ITEM DUMP 🧪🧪🧪");
//       }

//       /* ================= FILTER ================= */
//       if (item.cf_category !== "Relda") continue;

//       /* ================= ATTRIBUTES ================= */
//       const attributes = {};
//       if (item.attribute_name1)
//         attributes[item.attribute_name1] = item.attribute_option_name1;
//       if (item.attribute_name2)
//         attributes[item.attribute_name2] = item.attribute_option_name2;
//       if (item.attribute_name3)
//         attributes[item.attribute_name3] = item.attribute_option_name3;

//       /* ================= GST & PRICE ================= */
//       const basePrice = Number(item.rate || 0); // GST exclusive
//       const gstPercent = resolveGSTFromItem(item);

//       if (i === 0) {
//         console.log("🧾 PRICE + GST DEBUG (FIRST ITEM)");
//         console.log({
//           itemName: item.name,
//           rateFromZoho: item.rate,
//           is_taxable: item.is_taxable,
//           tax_name: item.tax_name,
//           tax_percentage: item.tax_percentage,
//           resolvedGST: gstPercent
//         });
//       }

//       const sellingPrice =
//         gstPercent !== null && gstPercent > 0
//           ? calculateInclusivePrice(basePrice, gstPercent)
//           : Math.round(basePrice);

//       /* ================= IMAGE ================= */
//       let productImages = [];

//       if (item.image_document_id) {
//         const cloudinaryImage =
//           await uploadZohoImageToCloudinary(item.item_id);

//         if (cloudinaryImage?.url) {
//           productImages.push({
//             url: cloudinaryImage.url,
//             type: "image"
//           });
//         }
//       }

//       /* ================= DB UPSERT ================= */
//       await productModel.findOneAndUpdate(
//         { zohoVariantId: item.item_id },
//         {
//           zohoItemId: item.group_id || item.item_id,
//           zohoVariantId: item.item_id,

//           productName: item.name,
//           parentName: item.group_name || "",
//           brandName: item.brand || "",

//           attributes,

//           basePrice,
//           gstPercent,
//           sellingPrice,

//           availability: item.available_stock,
//           productImage: productImages,
//           isHidden: item.status !== "active"
//         },
//         { upsert: true, new: true }
//       );

//       console.log(
//         "✅ Synced:",
//         item.name,
//         "| GST:",
//         gstPercent,
//         "| Price:",
//         sellingPrice
//       );
//     }

//     console.log("🎉 Zoho Relda products synced successfully");
//   } catch (err) {
//     console.error("❌ Zoho sync failed:", err.message);
//     throw err;
//   }
// };
// services/zohoProductSync.service.js

// exports.syncZohoVariantsAsProducts = async () => {
//   try {
//     const items = await fetchZohoItems();
//     console.log("📦 Fetched ZOHO items:", items.length);
    
//     console.log("🧪🧪🧪 FIRST ZOHO ITEM – FULL RAW OBJECT 🧪🧪🧪");
//     console.log(JSON.stringify(items[0], null, 2));
//     console.log("🧪🧪🧪 END OF FIRST ITEM DUMP 🧪🧪🧪");

//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];

//       if (item.category_name !== "Relda") continue;

//       const attributes = {};
//       if (item.attribute_name1)
//         attributes[item.attribute_name1] = item.attribute_option_name1;
//       if (item.attribute_name2)
//         attributes[item.attribute_name2] = item.attribute_option_name2;
//       if (item.attribute_name3)
//         attributes[item.attribute_name3] = item.attribute_option_name3;

//       const basePrice = Number(item.rate || 0);
//       const gstPercent = resolveGSTFromItem(item);

//       const sellingPrice =
//         gstPercent && gstPercent > 0
//           ? calculateInclusivePrice(basePrice, gstPercent)
//           : Math.round(basePrice);

//       let productImages = [];
//       if (item.image_document_id) {
//         const cloudinaryImage =
//           await uploadZohoImageToCloudinary(item.item_id);

//         if (cloudinaryImage?.url) {
//           productImages.push({ url: cloudinaryImage.url, type: "image" });
//         }
//       }

//       await productModel.findOneAndUpdate(
//         { zohoVariantId: item.item_id },
//         {
//           zohoItemId: item.group_id || item.item_id,
//           zohoVariantId: item.item_id,
//           productName: item.name,
//           parentName: item.group_name || "",
//           brandName: item.brand || "",
//           attributes,
//           basePrice,
//           gstPercent,
//           sellingPrice,
//           availability: item.available_stock,
//           productImage: productImages,
//           isHidden: item.status !== "active"
//         },
//         { upsert: true, new: true }
//       );
//     }

//     console.log("🎉 Zoho Relda products synced successfully");
//   } catch (err) {
//     console.error("❌ Zoho product sync failed:", err.message);
//     throw err;
//   }
// };
exports.syncZohoVariantsAsProducts = async () => {
  try {
    const items = await fetchZohoItems();

    let reldaCount = 0;

    for (const item of items) {

      if (item.category_name !== "Relda") continue;

      reldaCount++;

      console.log(
        `🟢 RELDA ITEM → ${item.name} | Category: ${item.category_name}`
      );

      const basePrice = Number(item.rate || 0);
      const gstPercent = resolveGSTFromItem(item);
      const sellingPrice =
        gstPercent > 0
          ? calculateInclusivePrice(basePrice, gstPercent)
          : Math.round(basePrice);

      await productModel.findOneAndUpdate(
        { zohoVariantId: item.item_id },
        {
          zohoVariantId: item.item_id,
          productName: item.name,
          basePrice,
          gstPercent,
          sellingPrice,
          availability: item.available_stock,
          isHidden: item.status !== "active"
        },
        { upsert: true, new: true }
      );

      console.log(
        `✅ Synced: ${item.name} | GST: ${gstPercent} | Price: ${sellingPrice}`
      );
    }

    console.log(
      `🎉 Zoho Relda products synced successfully | TOTAL RELDA: ${reldaCount}`
    );
  } catch (err) {
    console.error("❌ Zoho product sync failed:", err.message);
    throw err;
  }
};


exports.manualZohoProductSync = async (req, res) => {
  try {
    syncZohoVariantsAsProducts(); // fire & forget

    return res.json({
      success: true,
      message: "Zoho product sync triggered"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

