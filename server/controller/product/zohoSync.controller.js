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
const { fetchZohoItems } = require("../../services/zohoInventory.service");
const { uploadZohoImageToCloudinary } = require("../../services/zohoImageToCloudinary.service");

exports.syncZohoVariantsAsProducts = async () => {
  const items = await fetchZohoItems();

  console.log("Fetched ZOHO items:", items.length);

  for (const item of items) {

    // 🔹 Build attributes
    const attributes = {};
    if (item.attribute_name1)
      attributes[item.attribute_name1] = item.attribute_option_name1;
    if (item.attribute_name2)
      attributes[item.attribute_name2] = item.attribute_option_name2;
    if (item.attribute_name3)
      attributes[item.attribute_name3] = item.attribute_option_name3;

    // 🔥 IMAGE HANDLING
    let productImages = [];

    if (item.image_document_id) {
      const cloudinaryImage = await uploadZohoImageToCloudinary(item.item_id);

      if (cloudinaryImage) {
        productImages.push({
          url: cloudinaryImage.url,
          type: "image"
        });
      }
    }

    await productModel.findOneAndUpdate(
      { zohoVariantId: item.item_id },
      {
        zohoItemId: item.group_id || item.item_id,
        zohoVariantId: item.item_id,

        productName: item.name,
        parentName: item.group_name || "",
        brandName: item.brand || "",

        attributes,
        price: item.purchase_rate,
        sellingPrice: item.rate,
        availability: item.available_stock,

        productImage: productImages,
        isHidden: item.status !== "active"
      },
      { upsert: true, new: true }
    );
  }

  console.log("✅ Zoho variants + Cloudinary images synced");
};

