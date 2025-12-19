// const uploadProductPermission = require("../../helpers/permission")
// const productModel = require("../../models/productModel")
// const redisClient = require("../../config/redisClient");
// const { ALL_PRODUCTS_CACHE_KEY } = require("../../utils/constants");
// async function UploadProductController(req,res){
//     try{
//         const sessionUserId = req.userId

//         if(!uploadProductPermission(sessionUserId)){
//             throw new Error("Permission denied")
//         }
    
//         const uploadProduct = new productModel(req.body)
//         const saveProduct = await uploadProduct.save()
//         await redisClient.del(ALL_PRODUCTS_CACHE_KEY);
//         res.status(201).json({
//             message : "Product upload successfully",
//             error : false,
//             success : true,
//             data : saveProduct
//         })

//     }catch(err){
//         res.status(400).json({
//             message : err.message || err,
//             error : true,
//             success : false
//         })
//     }
// }

// module.exports = UploadProductController

// const uploadProductPermission = require("../../helpers/permission");
// const productModel = require("../../models/productModel");
// const redisClient = require("../../config/redisClient");
// const { ALL_PRODUCTS_CACHE_KEY } = require("../../utils/constants");
// const { sendToZoho } = require("../../helpers/zohoClient"); // CRM integration helper

// async function UploadProductController(req, res) {
//   try {
//     const sessionUserId = req.userId;

//     // Permission check
//     if (!uploadProductPermission(sessionUserId)) {
//       throw new Error("Permission denied");
//     }

//     // Save product to DB
//     const uploadProduct = new productModel(req.body);
//     const saveProduct = await uploadProduct.save();

//     // Clear Redis Cache
//     await redisClient.del(ALL_PRODUCTS_CACHE_KEY);

//     // Prepare payload for Zoho CRM
//     const crmPayload = {
//       Product_Name: saveProduct.name,
//       Description: saveProduct.description || "No description",
//       Unit_Price: saveProduct.price,
//       SKU: saveProduct.sku || `SKU-${saveProduct._id.toString().slice(-4)}`,
//       Category: saveProduct.category || 'General'
//     };

//     try {
//       // Send to Zoho CRM
//       await sendToZoho("Products", crmPayload);
//       console.log("✅ Product synced with Zoho CRM");
//     } catch (crmErr) {
//       console.error("⚠️ Zoho CRM Sync Failed:", crmErr.message);
//     }

//     res.status(201).json({
//       message: "✅ Product uploaded and synced with Zoho CRM",
//       error: false,
//       success: true,
//       data: saveProduct
//     });

//   } catch (err) {
//     res.status(400).json({
//       message: err.message || err,
//       error: true,
//       success: false
//     });
//   }
// }

// module.exports = UploadProductController;

// const productModel = require("../../models/productModel");
// const uploadProductPermission = require("../../helpers/permission");

// const { sendToZoho } = require("../../helpers/zohoClient");

// async function UploadProductController(req, res) {
//   try {
//     const productData = req.body;

//     // Save product locally
//     const saveProduct = await new productModel(productData).save();

//     // Push to Zoho CRM
//     const zohoPayload = {
//       Product_Name: productData.productName,
//       Price: productData.price,
//       Description: productData.description,
//     };

//     const zohoResponse = await sendToZoho("Products", zohoPayload);

//     res.status(201).json({
//       message: "✅ Product uploaded and synced with Zoho CRM!",
//       data: {
//         local: saveProduct,
//         crm: zohoResponse,
//       }
//     });

//   } catch (err) {
//     res.status(400).json({
//       error: true,
//       message: err.message || "Upload failed",
//     });
//   }
// }
// module.exports = UploadProductController;


const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");
const redisClient = require("../../config/redisClient");
const { ALL_PRODUCTS_CACHE_KEY } = require("../../utils/constants");
const { sendToZoho, uploadImageToField } = require("../../helpers/zohoClient");
const { addOrUpdateInventoryItem } = require("../../helpers/zohoInventoryClient");
async function UploadProductController(req, res) {
  try {
    const sessionUserId = req.userId;

    // 1. Permission check
    if (!uploadProductPermission(sessionUserId)) {
      throw new Error("Permission denied");
    }

    // 2. Validate image URLs
    const productImages = req.body.productImage;
    if (!Array.isArray(productImages) || productImages.length === 0) {
      throw new Error("Product image URLs are required");
    }

    // 3. Save product to MongoDB
    const uploadProduct = new productModel(req.body);
    const saveProduct = await uploadProduct.save();

    // 4. Clear Redis Cache
    await redisClient.del(ALL_PRODUCTS_CACHE_KEY);

    // 5. Extract first image URL
    const firstImageUrl = typeof saveProduct.productImage[0] === "string"
      ? saveProduct.productImage[0]
      : saveProduct.productImage[0]?.url || "";

    // 6. Prepare Zoho CRM payload
    const crmPayload = {
      Product_Name: saveProduct.productName,
      Description: saveProduct.description || "No description",
      Unit_Price: saveProduct.sellingPrice || saveProduct.price || 0,
      SKU: `SKU-${saveProduct._id.toString().slice(-6)}`,
      Product_Category: saveProduct.category || "General",
      Qty_in_Stock: saveProduct.availability || 0,
      Manufacturer: saveProduct.brandName || "Unknown",
      Average_Rating: saveProduct.averageRating || 0,
      Review_Count: saveProduct.reviewCount || 0,
      Specifications: JSON.stringify(saveProduct.specifications || []),
      All_Images_JSON: JSON.stringify(saveProduct.productImage || []),
    };

    // 7. Send to Zoho CRM
    let zohoResponse;
    try {
      zohoResponse = await sendToZoho("Products", crmPayload);
      console.log("✅ Product synced with Zoho CRM");
    } catch (crmErr) {
      console.error("⚠️ Zoho CRM Sync Failed:", crmErr.response?.data || crmErr.message);
    }

    // 8. Upload image to Zoho Record_Image field & save zohoId
    try {
      const zohoId = zohoResponse?.data?.[0]?.details?.id;

      if (!zohoId) {
        throw new Error("Zoho record ID not found");
      }

      // Save zohoId in MongoDB
      await productModel.findByIdAndUpdate(saveProduct._id, { zohoId });

      if (firstImageUrl) {
        await uploadImageToField("Products", zohoId, firstImageUrl);
        console.log("📸 Record_Image uploaded to Zoho CRM");
      }
    } catch (uploadErr) {
      console.error("❌ Failed to upload image or save Zoho ID:", uploadErr.response?.data || uploadErr.message);
    }

    // 9. Respond to client
    res.status(201).json({
      message: "✅ Product uploaded and synced with Zoho CRM",
      error: false,
      success: true,
      data: saveProduct,
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || "Upload failed",
      error: true,
      success: false,
    });
  }
}

module.exports = UploadProductController;

