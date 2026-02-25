const mongoose = require('mongoose')
const { base } = require('./userModel')

const productSchema = mongoose.Schema({
     zohoItemId: { type: String, unique: true },
      zohoVariantId: { type: String, unique: true },       // variant item id'
    productName : String,
    brandName : String,
    // category : String,
//     category: [{
//   type: String,
//   index: true
// }],
    // ✅ MAIN CATEGORY (Single)
    category: { 
      type: String, 
      index: true 
    },

    // ✅ VISIBLE CATEGORIES (Multiple)
    visibleCategories: {
      type: [String],
      index: true
    },
    productImage : [],
    altTitle : String,
    description : String,
    price : Number,
    sellingPrice : Number,
    basePrice : Number,
    availability: {type: Number},
    reservedStock: { type: Number, default: 0 }, // Locked stock
      attributes: {
    type: Object              // { Color: "Red", Size: "M" }
  },
    specifications: [
        {
            key: { type: String },
            value: { type: String }
        }
    ],
    isHidden: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 }, // Average product rating
    reviewCount: { type: Number, default: 0 },   // Total review count
    
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel