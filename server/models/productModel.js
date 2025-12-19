const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String,
    brandName : String,
    category : String,
    productImage : [],
    altTitle : String,
    description : String,
    price : Number,
    sellingPrice : Number,
    availability: {type: Number},
    specifications: [
        {
            key: { type: String },
            value: { type: String }
        }
    ],
    isHidden: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 }, // Average product rating
    reviewCount: { type: Number, default: 0 },   // Total review count
      zohoId: { type: String, default: null },
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel