// const mongoose = require("mongoose");

// const bannerSchema = new mongoose.Schema(
//   {
//     desktopImage: {
//       type: String,
//       required: true
//     },
//     mobileImage: {
//       type: String,
//       required: true
//     },
//     title: {
//       type: String
//     },
//     link: {
//       type: String
//     },
//     isActive: {
//       type: Boolean,
//       default: true
//     },
//     order: {
//       type: Number,
//       default: 0
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// module.exports = mongoose.model("Banner", bannerSchema);


// const mongoose = require("mongoose");

// const bannerSchema = new mongoose.Schema(
//   {
//     imageUrl: {
//       type: String,
//       required: true,
//     },

//     position: {
//       type: String,
//       enum: ["home-top", "home-bottom"],
//       required: true,
//     },

//     redirectType: {
//       type: String,
//       enum: ["category", "product", "custom"],
//       required: true,
//     },

//     redirectValue: {
//       type: String, // category slug / productId / url
//       required: true,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     order: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Banner", bannerSchema);


const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true
    },

    desktopImage: {
      type: String,
      required: true
    },

    mobileImage: {
      type: String,
      required: true
    },

    link: {
      type: String,
      required: true
    },

    position: {
      type: String,
      enum: ["home-top", "home-bottom"],
      required: true
    },

    order: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
