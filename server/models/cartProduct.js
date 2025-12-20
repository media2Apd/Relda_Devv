// const mongoose = require('mongoose');

// const addToCart = mongoose.Schema({
//     productId: {
//         ref: 'product',
//         type: String,
//     },
//     category: {
//         type: String,
//     },
//     quantity: Number,
//     userId:   {
//         ref: 'User', 
//         type: String
//       }
// }, {
//     timestamps: true
// });

// const addToCartModel = mongoose.model("addToCart", addToCart);

// module.exports = addToCartModel;


const mongoose = require('mongoose');

const addToCart = mongoose.Schema({
  productId: {
    ref: 'product',
    // type: String,
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  category: String,
  quantity: {
    type: Number,
    default: 1
  },

  userId: {
    ref: 'User',
    type: String,
    default: null
  },

  sessionId: {
    type: String,
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("addToCart", addToCart);
