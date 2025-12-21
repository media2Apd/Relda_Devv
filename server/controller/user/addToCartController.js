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

const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId || null;
    const sessionId = req.sessionId || null;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: "Invalid session"
      });
    }

    const product = await productModel.findById(productId);

    const filter = userId
      ? { productId, userId }
      : { productId, sessionId };

    const exists = await addToCartModel.findOne(filter);
    // 🔥 12 HOURS RULE
    if (exists) {
      const now = Date.now();
      const addedTime = new Date(exists.createdAt).getTime();

      if (now - addedTime < TWELVE_HOURS) {
        return res.status(400).json({
          success: false,
          message: "You can add this product only once every 12 hours"
        });
      }
    }


    const payload = {
      productId,
      category: product.category,
      quantity: 1,
      ...(userId ? { userId } : { sessionId })
    };

    const saved = await addToCartModel.create(payload);

    res.json({
      success: true,
      message: "Product added to cart",
      data: saved
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};



module.exports = {addToCartController}