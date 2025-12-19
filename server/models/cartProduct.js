const mongoose = require('mongoose');

const addToCart = mongoose.Schema({
    productId: {
        ref: 'product',
        type: String,
    },
    category: {
        type: String,
    },
    quantity: Number,
    userId:   {
        ref: 'User', 
        type: String
      },
      zohoProductId: {
  type: String,
  default: null,
},
zohoLeadId: {
  type: String,
  default: null,
},

}, {
    timestamps: true
});

const addToCartModel = mongoose.model("addToCart", addToCart);

module.exports = addToCartModel;

