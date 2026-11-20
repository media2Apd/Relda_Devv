
const mongoose = require("mongoose");

const documentSnapshotSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

const authorizedBrandShopSchema = new mongoose.Schema(
  {
    // Initial website application fields
    proprietorName: {
      type: String,
      required: [true, "Proprietor/Owner name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },

    // SECTION 1 - BUSINESS INFORMATION
    businessName: { type: String, default: null, trim: true },
    contactPerson: { type: String, default: null, trim: true },
    whatsapp: { type: String, default: null, trim: true },
    address: { type: String, default: null, trim: true },
    district: { type: String, default: null, trim: true },
    pinCode: { type: String, default: null, trim: true },

    businessType: {
      type: String,
      enum: ["Proprietorship", "Partnership", "Private Limited", "LLP", "Others"],
      default: null
    },
    establishmentYear: { type: String, default: null, trim: true },
    gstNumber: { type: String, default: null, trim: true },
    panNumber: { type: String, default: null, trim: true },

    // SECTION 2 - BUSINESS PROFILE
    currentCategory: {
      type: String,
      enum: [
        "Home Appliances",
        "Electronics",
        "Electrical",
        "Kitchen Appliances",
        "Consumer Durables",
        "Others"
      ],
      default: null
    },
    brandsDealt: { type: String, default: null, trim: true },
    experience: {
      type: String,
      enum: [
        "Less than 1 Year",
        "1-3 Years",
        "3-5 Years",
        "5-10 Years",
        "More than 10 Years"
      ],
      default: null
    },

    // SECTION 3 - BRAND SHOP DETAILS
    proposedLocation: { type: String, default: null, trim: true },
    shopOwnership: {
      type: String,
      enum: ["Owned", "Rented", "Lease"],
      default: null
    },
    shopArea: { type: String, default: null, trim: true },
    shopFrontage: { type: String, default: null, trim: true },
    landmark: { type: String, default: null, trim: true },

    investmentCapacity: {
      type: String,
      enum: [
        "5 Lakhs",
        "10 Lakhs",
        "20 Lakhs",
        "30 Lakhs",
        "50 Lakhs",
        "Above 50 Lakhs"
      ],
      default: null
    },
    monthlyTurnover: {
      type: String,
      enum: [
        "Below 5 Lakhs",
        "5-10 Lakhs",
        "10-25 Lakhs",
        "25-50 Lakhs",
        "Above 50 Lakhs"
      ],
      default: null
    },
    salesStaff: { type: String, default: null, trim: true },
    customerFootfall: {
      type: String,
      enum: [
        "Below 20 Customers/Day",
        "20-50 Customers/Day",
        "50-100 Customers/Day",
        "Above 100 Customers/Day"
      ],
      default: null
    },

    // SECTION 4 - DOCUMENTS
    documentSnapshot: {
      type: [documentSnapshotSchema],
      default: null
    },

    // SECTION 5 - ADDITIONAL INFORMATION
    reason: { type: String, default: null, trim: true },

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

const AuthorizedBrandShop = mongoose.model(
  "AuthorizedBrandShop",
  authorizedBrandShopSchema
);

module.exports = AuthorizedBrandShop;
