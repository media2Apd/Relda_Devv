const mongoose = require("mongoose");

const parentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // description: {
  //   type: String,
  //   required: true,
  // },
  categoryImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ParentCategory", parentCategorySchema);
