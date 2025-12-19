const mongoose = require('mongoose');
const { image } = require('../config/cloudinary');

const offerPosterSchema = new mongoose.Schema({
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParentCategory' // The model name it references
        // type: String,
        // required: true
    },
    childCategory: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
},{timestamps: true});
module.exports = mongoose.model('OfferPoster', offerPosterSchema);