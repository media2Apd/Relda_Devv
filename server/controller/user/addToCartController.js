const addToCartModel = require("../../models/cartProduct")
const userModel = require("../../models/userModel"); 
const productModel = require("../../models/productModel")

// const addToCartController = async(req,res)=>{
//     try{
//         const { productId } = req?.body
//         const currentUser = req.userId

//         const isProductAvailable = await addToCartModel.findOne({ productId , userId : currentUser})
//         const product = await productModel.findById(productId)
        
//         if(isProductAvailable){
//             return res.json({
//                 message : "Already exits in Add to cart",
//                 success : false,
//                 error : true
//             })
//         }

//         const payload  = {
//             productId : productId,
//             category:product.category,
//             quantity : 1,
//             userId : currentUser,
//         }

//         const newAddToCart = new addToCartModel(payload)
//         const saveProduct = await newAddToCart.save()


//         return res.json({
//             data : saveProduct,
//             message : "Product Added in Cart",
//             success : true,
//             error : false
//         })
        

//     }catch(err){
//         res.json({
//             message : err?.message || err,
//             error : true,
//             success : false
//         })
//     }
// }
const { sendToZoho } = require("../../helpers/zohoClient"); // Import Zoho helper

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    // Check for duplicate cart entry
    const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser });
    if (isProductAvailable) {
      return res.json({
        message: "Already exists in Add to Cart",
        success: false,
        error: true,
      });
    }

    // Get product and user info
    const product = await productModel.findById(productId);
    const user = await userModel.findById(currentUser);
    if (!product || !user) {
      return res.status(404).json({
        message: "User or Product not found",
        success: false,
        error: true,
      });
    }

    // Save cart item (with Zoho Product ID)
    const payload = {
      productId,
      category: product.category,
      quantity: 1,
      userId: currentUser,
      zohoProductId: product.zohoId || null,  // 👈 Save the Zoho product ID here
    };

    const newAddToCart = new addToCartModel(payload);
    const saveProduct = await newAddToCart.save();

    // 🎯 CRM Sync - Create a lead in Zoho
    const crmPayload = {
      Last_Name: user.name || "Cart User",
      Email: user.email,
      Phone: user.mobile,
      Lead_Source: "Add to Cart",
      Company: "RELDA Cart",
      Description: `User added product (${product._id}, ${product.productName}) from category (${product.category}) to cart.`,
    };

    const zohoResponse = await sendToZoho("Leads", crmPayload);
    const zohoLeadId = zohoResponse?.data?.[0]?.details?.id;

    // ✅ Store zohoLeadId in the cart item
    if (zohoLeadId) {
      saveProduct.zohoLeadId = zohoLeadId;
      await saveProduct.save();
    }

    return res.json({
      data: saveProduct,
      message: "Product Added in Cart",
      success: true,
      error: false,
    });

  } catch (err) {
    console.error("Error in addToCartController:", err.message || err);
    return res.status(500).json({
      message: err?.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

module.exports = { addToCartController };