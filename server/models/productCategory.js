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
// const mongoose = require("mongoose");

// const ProductCategorySchema = new mongoose.Schema({
//   label: { type: String, required: true },
//   value: { type: String, required: true, unique: true },
//   categoryImage: { type: String, required: true },
//   parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "ParentCategory", default: null }, // Link to parent category
//   isHide: { type: Boolean, default: false },
// });

// module.exports = mongoose.model("ProductCategory", ProductCategorySchema);
const mongoose = require("mongoose");

const ProductCategorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParentCategory",
      default: null,
    },
    isHide: {
      type: Boolean,
      default: false,
    },
    organizationId: {
      type: String,
      index: true,
      sparse: true,
      default: null,
    },
    erpId: {
      type: String,
      index: true,
      sparse: true,
    },
    source: {
      type: String,
      enum: ["MANUAL", "ERP"],
      default: "MANUAL",
    },
    lastSyncedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ProductCategory =
  mongoose.models.ProductCategory ||
  mongoose.model("ProductCategory", ProductCategorySchema);

module.exports = ProductCategory;