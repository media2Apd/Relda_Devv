const mongoose = require("mongoose");

const documentSnapshotSchema = new mongoose.Schema({
  shopFrontPhoto: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  },
  shopInteriorPhotos: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  },
  gstCertificate: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  },
  ownershipProof: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  }
}, { _id: false });

const authorizedBrandShopSchema = new mongoose.Schema(
  {
    // SECTION 1 - BUSINESS INFORMATION
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true
    },
    proprietorName: {
      type: String,
      required: [true, "Proprietor/Owner name is required"],
      trim: true
    },
    contactPerson: {
      type: String,
      required: [true, "Contact person name is required"],
      trim: true
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    address: {
      type: String,
      required: [true, "Shop address is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    pinCode: {
      type: String,
      required: [true, "PIN code is required"],
      trim: true
    },

    // Business Type
    businessType: {
      type: String,
      enum: ["Proprietorship", "Partnership", "Private Limited", "LLP", "Others"],
      required: [true, "Business type is required"]
    },
    establishmentYear: {
      type: String,
      trim: true
    },
    gstNumber: {
      type: String,
      trim: true
    },
    panNumber: {
      type: String,
      trim: true
    },

    // SECTION 2 - BUSINESS PROFILE
    currentCategory: {
      type: String,
      enum: ["Home Appliances", "Electronics", "Electrical", "Kitchen Appliances", "Consumer Durables", "Others"]
    },
    brandsDealt: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      enum: [
        "Less than 1 Year",
        "1-3 Years",
        "3-5 Years",
        "5-10 Years",
        "More than 10 Years"
      ]
    },

    // SECTION 3 - BRAND SHOP DETAILS
    proposedLocation: {
      type: String,
      trim: true
    },
    shopOwnership: {
      type: String,
      enum: ["Owned", "Rented", "Lease"]
    },
    shopArea: {
      type: String,
      trim: true
    },
    shopFrontage: {
      type: String,
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    },
    investmentCapacity: {
      type: String,
      enum: [
        "5 Lakhs",
        "10 Lakhs",
        "20 Lakhs",
        "30 Lakhs",
        "50 Lakhs",
        "Above 50 Lakhs"
      ]
    },
    monthlyTurnover: {
      type: String,
      enum: [
        "Below 5 Lakhs",
        "5-10 Lakhs",
        "10-25 Lakhs",
        "25-50 Lakhs",
        "Above 50 Lakhs"
      ]
    },
    salesStaff: {
      type: String,
      trim: true
    },
    customerFootfall: {
      type: String,
      enum: [
        "Below 20 Customers/Day",
        "20-50 Customers/Day",
        "50-100 Customers/Day",
        "Above 100 Customers/Day"
      ]
    },

    // SECTION 4 - DOCUMENTS
    documentSnapshot: [documentSnapshotSchema],

    // SECTION 5 - ADDITIONAL INFORMATION
    reason: {
      type: String,
      trim: true
    },

    // Status
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"]
    }
  },
  {
    timestamps: true
  }
);

const AuthorizedBrandShop = mongoose.model("AuthorizedBrandShop", authorizedBrandShopSchema);

module.exports = AuthorizedBrandShop;