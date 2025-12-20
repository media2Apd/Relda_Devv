// const mongoose = require("mongoose");

// const ProductCategorySchema = new mongoose.Schema({
//     label: {
//         type: String,
//         required: true,
//     },
//     value: {
//         type: String,
//         required: true,
//     },
//     categoryImage: {
//         // data:Buffer,
//         type: String, 
//         contentType: String
//     },
// }, { timestamps: true });

// module.exports = mongoose.model("ProductCategory", ProductCategorySchema);
const mongoose = require("mongoose");

const ProductCategorySchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true, unique: true },
  categoryImage: { type: String, required: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "ParentCategory", default: null }, // Link to parent category
  isHide: { type: Boolean, default: false },
});

module.exports = mongoose.model("ProductCategory", ProductCategorySchema);
