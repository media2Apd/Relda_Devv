const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')

async function updateProductController(req,res){
    try{

        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body

        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        
        res.json({
            message : "Product update successfully",
            data : updateProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = updateProductController

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
