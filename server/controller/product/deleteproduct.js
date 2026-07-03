const product = require("../../models/productModel")

async function deleteProductController(req,res){
    try{
        const { id } = req.params
        const deleteProduct = await product.findByIdAndDelete(id)
        res.json({
            message : "Product deleted successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}
module.exports = deleteProductController