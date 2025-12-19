// const uploadProductPermission = require('../../helpers/permission')
// const productModel = require('../../models/productModel')
// const redisClient = require('../../config/redisClient')
// const { ALL_PRODUCTS_CACHE_KEY } = require('../../utils/constants')
// async function updateProductController(req,res){
//     try{

//         if(!uploadProductPermission(req.userId)){
//             throw new Error("Permission denied")
//         }

//         const { _id, ...resBody} = req.body

//         const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
//         await redisClient.del(ALL_PRODUCTS_CACHE_KEY)
//         res.json({
//             message : "Product update successfully",
//             data : updateProduct,
//             success : true,
//             error : false
//         })

//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }


// module.exports = updateProductController

// const uploadProductPermission = require('../../helpers/permission');
// const productModel = require('../../models/productModel');
// const redisClient = require('../../config/redisClient');
// const { ALL_PRODUCTS_CACHE_KEY } = require('../../utils/constants');
// const { sendToZoho, updateZohoRecord, uploadImageToField } = require('../../helpers/zohoClient');
// const { addOrUpdateInventoryItem } = require("../../helpers/zohoInventoryClient");
// async function updateProductController(req, res) {
//   try {
//     if (!uploadProductPermission(req.userId)) {
//       throw new Error("Permission denied");
//     }

//     const { _id, ...resBody } = req.body;

//     // 1. Update product in MongoDB
//     const updateProduct = await productModel.findByIdAndUpdate(_id, resBody, { new: true });
//     if (!updateProduct) throw new Error("Product not found");

//     // 2. Clear Redis Cache
//     await redisClient.del(ALL_PRODUCTS_CACHE_KEY);

//     // 3. Prepare Zoho CRM payload
//     const firstImageUrl = typeof updateProduct.productImage[0] === 'string'
//       ? updateProduct.productImage[0]
//       : updateProduct.productImage[0]?.url || '';

//     const crmPayload = {
//       Product_Name: updateProduct.productName,
//       Description: updateProduct.description || "No description",
//       Unit_Price: updateProduct.sellingPrice || updateProduct.price || 0,
//       SKU: `SKU-${updateProduct._id.toString().slice(-6)}`,
//       Product_Category: updateProduct.category || 'General',
//       Qty_in_Stock: updateProduct.availability || 0,
//       Manufacturer: updateProduct.brandName,
//       Average_Rating: updateProduct.averageRating,
//       Review_Count: updateProduct.reviewCount,
//       Specifications: JSON.stringify(updateProduct.specifications || []),
//       All_Images_JSON: JSON.stringify(updateProduct.productImage || []),
//     };

//     let zohoId = updateProduct.zohoId;
// console.log(crmPayload);

//     try {
//       // 4. Sync to Zoho
//       if (!zohoId) {
//         // 🆕 No Zoho ID? Create new record
//         const createRes = await sendToZoho("Products", crmPayload);
//         zohoId = createRes?.data?.[0]?.details?.id;

//         if (!zohoId) throw new Error("Failed to create product in Zoho CRM");

//         // Save Zoho ID to DB
//         await productModel.findByIdAndUpdate(_id, { zohoId });
//         console.log("🆕 Zoho product created and ID saved to DB");
//       } else {
//         // 🔁 Existing record? Update it
//         await updateZohoRecord("Products", zohoId, crmPayload);
//         console.log("✅ Zoho CRM product updated");
//       }

//       // 5. Upload 'Record_Image'
//       if (firstImageUrl) {
//         await uploadImageToField("Products", zohoId, firstImageUrl);
//         console.log("📸 Record_Image updated in Zoho CRM");
//       }

//     } catch (zohoErr) {
//       console.error("❌ Zoho sync failed:", zohoErr.message || zohoErr);
//     }
//     // await addOrUpdateInventoryItem(updateProduct);
//     // 6. Final response
//     res.json({
//       message: "✅ Product updated and synced with Zoho CRM",
//       data: updateProduct,
//       success: true,
//       error: false,
//     });

//   } catch (err) {
//     res.status(400).json({
//       message: err.message || err,
//       error: true,
//       success: false,
//     });
//   }
// }

// module.exports = updateProductController;
const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const redisClient = require('../../config/redisClient');
const { ALL_PRODUCTS_CACHE_KEY } = require('../../utils/constants');
const { sendToZoho, updateZohoRecord, uploadImageToField } = require('../../helpers/zohoClient');
// const { addOrUpdateInventoryItem } = require("../../helpers/zohoInventoryClient");

async function updateProductController(req, res) {
  try {
    // 1. Permission check
    if (!uploadProductPermission(req.userId)) {
      throw new Error("Permission denied");
    }

    const { _id, ...resBody } = req.body;

    // 2. Update product in MongoDB
    const updateProduct = await productModel.findByIdAndUpdate(_id, resBody, { new: true });
    if (!updateProduct) throw new Error("Product not found");

    // 3. Clear Redis Cache
    await redisClient.del(ALL_PRODUCTS_CACHE_KEY);

    // 4. Prepare Zoho CRM payload
    const firstImageUrl = typeof updateProduct.productImage?.[0] === 'string'
      ? updateProduct.productImage[0]
      : updateProduct.productImage?.[0]?.url || '';

    const crmPayload = {
      Product_Name: `${updateProduct.productName} #${updateProduct._id.toString().slice(-4)}`,
      Description: updateProduct.description || "No description",
      Unit_Price: updateProduct.sellingPrice || updateProduct.price || 0,
      SKU: `SKU-${updateProduct._id.toString().slice(-6)}`,
      Product_Category: updateProduct.category || 'General',
      Qty_in_Stock: updateProduct.availability || 0,
      Manufacturer: updateProduct.brandName,
      Average_Rating: updateProduct.averageRating,
      Review_Count: updateProduct.reviewCount,
      Specifications: JSON.stringify(updateProduct.specifications || []),
      All_Images_JSON: JSON.stringify(updateProduct.productImage || []),
    };

    let zohoId = updateProduct.zohoId;

    try {
      // 5. Sync to Zoho CRM
      if (!zohoId) {
        console.log("🆕 No Zoho ID. Creating new product in Zoho CRM...");

        const createRes = await sendToZoho("Products", crmPayload);
        console.log("✅ Zoho create response:", JSON.stringify(createRes, null, 2));

        const newZohoId = createRes?.data?.[0]?.details?.id;
        if (!newZohoId) {
          throw new Error("❌ Failed to create product in Zoho CRM");
        }

        zohoId = newZohoId;
        await productModel.findByIdAndUpdate(_id, { zohoId });
        console.log("✅ New Zoho ID saved to DB:", zohoId);

      } else {
        console.log("🔁 Updating existing Zoho CRM record:", zohoId);
        await updateZohoRecord("Products", zohoId, crmPayload);
        console.log("✅ Zoho CRM product updated");
      }

      // 6. Upload image to Record_Image field in Zoho
      if (zohoId && firstImageUrl) {
        try {
          await uploadImageToField("Products", zohoId, firstImageUrl);
          console.log("📸 Record_Image updated in Zoho CRM");
        } catch (imgErr) {
          console.error("❌ Failed to upload image to Zoho field:", imgErr?.response?.data || imgErr.message);
        }
      }

    } catch (zohoErr) {
      console.error("❌ Zoho sync failed:", zohoErr?.response?.data || zohoErr.message || zohoErr);
    }

    // 7. Final response
    res.json({
      message: "✅ Product updated and synced with Zoho CRM",
      data: updateProduct,
      success: true,
      error: false,
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = updateProductController;



// const uploadProductPermission = require('../../helpers/permission');
// const productModel = require('../../models/productModel');

// async function updateProductController(req, res) {
//     try {
//         if (!uploadProductPermission(req.userId)) {
//             throw new Error("Permission denied");
//         }

//         const { _id, price, offer, userId, specificUserId, newSellingPrice, ...resBody } = req.body;

//         // Check if the user is eligible for the offer
//         if (userId && offer) {
//             // Apply the offer to the price
//             resBody.price = price - (price * offer / 100);
//         }

//         // Check if the specific user ID matches and apply the new selling price
//         if (req.userId === specificUserId) {
//             resBody.sellingPrice = newSellingPrice;
//         }

//         const updateProduct = await productModel.findByIdAndUpdate(_id, resBody, { new: true });

//         res.json({
//             message: "Product updated successfully",
//             data: updateProduct,
//             success: true,
//             error: false
//         });

//     } catch (err) {
//         res.status(400).json({
//             message: err.message || err,
//             error: true,
//             success: false
//         });
//     }
// }

// module.exports = updateProductController;
