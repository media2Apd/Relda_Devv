
const { required } = require("joi");
const mongoose = require("mongoose");

const documentSnapshotSchema = new mongoose.Schema(
  {
    gstCertificate: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null }
    },
    shopPhoto: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null }
    },
    warehousePhoto: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null }
    },
    visitingCard: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null }
    }
  },
  { _id: false }
);

const authorizedDistributorSchema = new mongoose.Schema(
  {
    // Initial website application fields - Only 5 required

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true
    },

    proprietorName: {
      type: String,
      required: [true, "Proprietor name is required"],
      trim: true
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true
    },
address: {
  type: String,
  default: null,
  trim: true
},

    // Remaining Business Information - Admin fills later

    contactPerson: { type: String, default: null, trim: true },

    whatsapp: { type: String, default: null, trim: true },

    city: { type: String, required:true, trim: true },

    district: { type: String, default: null, trim: true },

    state: { type: String, required:true,trim:true },

    pinCode: { type: String, default: null, trim: true },

    businessType: {
      type: String,
      enum: [
        "Proprietorship",
        "Partnership",
        "Private Limited",
        "LLP",
        "Other"
      ],
      default: null
    },

    establishmentYear: { type: Number, default: null },

    gstNumber: { type: String, default: null },

    panNumber: { type: String, default: null },

    productCategories: {
      type: [String],
      default: null
    },

    distributedBrands: { type: String, default: null },

    experience: { type: String, default: null },

    monthlyTurnover: { type: String, default: null },

    coverageAreas: { type: String, default: null },

    salesExecutives: { type: Number, default: null },

    deliveryVehicles: { type: Number, default: null },

    warehouseAvailable: { type: Boolean, default: null },

    warehouseSize: { type: String, default: null },

    dealersCount: { type: String, default: null },

    expectedPurchase: { type: String, default: null },

    investmentCapacity: { type: String, default: null },

    // Documents
    documentSnapshot: {
      type: [documentSnapshotSchema],
      default: null
    },

    // Additional Information
    reason: { type: String, default: null },

    additionalComments: { type: String, default: null },

    // Status
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"]
    },
    rejectionReason: {
    type: String,
    trim: true,
    default: "",
   }
  },
  {
    timestamps: true
  }
);

const AuthorizedDistributor = mongoose.model(
  "AuthorizedDistributor",
  authorizedDistributorSchema
);

module.exports = AuthorizedDistributor;
