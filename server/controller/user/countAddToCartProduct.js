// const addToCartModel = require("../../models/cartProduct")

// const countAddToCartProduct = async(req,res)=>{
//     try{
//         const userId = req.userId

//         const count = await addToCartModel.countDocuments({
//             userId : userId
//         })

//         res.json({
//             data : {
//                 count : count
//             },
//             message : "ok",
//             error : false,
//             success : true
//         })
//     }catch(error){
//         res.json({
//             message : error.message || error,
//             error : false,
//             success : false,
//         })
//     }
// }

// module.exports = countAddToCartProduct

const addToCartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId || null;
    const sessionId = req.sessionId || null;

    // If both missing → empty cart
    if (!userId && !sessionId) {
      return res.json({
        data: { count: 0 },
        success: true,
        error: false
      });
    }

    const filter = userId
      ? { userId }
      : { sessionId };

    const count = await addToCartModel.countDocuments(filter);

    res.json({
      data: { count },
      success: true,
      error: false
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      success: false,
      error: true
    });
  }
};

module.exports = countAddToCartProduct;
