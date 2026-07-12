// const mongoose = require("mongoose");

// const parentCategorySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   // description: {
//   //   type: String,
//   //   required: true,
//   // },
//   categoryImage: {
//     type: String,
//     required: true,
//   },
//   isHide: {
//     type: Boolean,
//     default: false,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model("ParentCategory", parentCategorySchema);
const mongoose = require("mongoose");

const parentCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    categoryImage: {
      type: String,
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
    // ERP sync fields
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

// Compound unique — same erpId + organizationId can't create twice
// parentCategorySchema.index(
//   { erpId: 1, organizationId: 1 },
//   { unique: true, sparse: true }
// );

module.exports = mongoose.model("ParentCategory", parentCategorySchema);
