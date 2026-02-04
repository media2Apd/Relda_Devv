// const uploadProductPermission = require("../../helpers/permission")
// const productModel = require("../../models/productModel")

// async function UploadProductController(req,res){
//     try{
//         const sessionUserId = req.userId

//         if(!uploadProductPermission(sessionUserId)){
//             throw new Error("Permission denied")
//         }
    
//         const uploadProduct = new productModel(req.body)
//         const saveProduct = await uploadProduct.save()

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

const productModel = require("../../models/productModel");
const uploadProductPermission = require("../../helpers/permission");
const { createZohoItem } = require("../../services/zohoInventory.service");

/**
 * PRODUCT UPLOAD CONTROLLER
 * Website → Zoho Inventory → Website DB
 */
async function uploadProductController(req, res) {
  try {
    const userId = req.userId;

    // 🔐 Permission check
    if (!uploadProductPermission(userId)) {
      return res.status(403).json({
        success: false,
        message: "Permission denied"
      });
    }

    /**
     * STEP 1: Create product in WEBSITE DB first
     */
    const product = await productModel.create({
      productName: req.body.productName,
      brandName: req.body.brandName,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      sellingPrice: req.body.sellingPrice,

      // 🔥 INVENTORY INIT
      availability: req.body.availability ?? 0,
      reservedStock: 0,

      specifications: req.body.specifications || [],
      productImage: req.body.productImage || []
    });

    /**
     * STEP 2: Create item in ZOHO INVENTORY
     */
    const zohoItem = await createZohoItem(product);

    /**
     * STEP 3: Save Zoho Item ID for future sync
     */
    product.zohoItemId = zohoItem.item_id;
    await product.save();

    /**
     * FINAL RESPONSE
     */
    res.status(201).json({
      success: true,
      message: "Product uploaded & synced with Zoho Inventory",
      data: product
    });

  } catch (error) {
    console.error("UPLOAD PRODUCT ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
}

module.exports = uploadProductController;
