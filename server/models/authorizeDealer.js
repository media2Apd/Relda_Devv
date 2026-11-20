
const mongoose = require("mongoose");

const documentSnapshotSchema = new mongoose.Schema(
  {
    shopFrontPhoto: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null },
    },
    shopInteriorPhoto: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null },
    },
    gstCertificate: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null },
    },
    visitingCard: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
      type: { type: String, default: null },
    },
  },
  { _id: false }
);

const authorizeDealerSchema = new mongoose.Schema(
  {
    // INITIAL WEBSITE APPLICATION FIELDS

    businessName: {
      type: String,
      default: null,
      trim: true,
    },

    proprietorName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    contactPerson: {
      type: String,
      default: null,
      trim: true,
    },

    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    whatsapp: {
      type: String,
      default: null,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    address: {
      type: String,
      default: null,
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    district: {
      type: String,
      default: null,
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    pinCode: {
      type: String,
      default: null,
      trim: true,
    },

    // BUSINESS DETAILS (ADMIN PANEL)

    businessType: {
      type: String,
      enum: [
        "Proprietorship",
        "Partnership",
        "Private Limited",
        "LLP",
        "Other",
      ],
      default: null,
    },

    establishmentYear: {
      type: String,
      default: null,
    },

    gstNumber: {
      type: String,
      default: null,
      trim: true,
    },

    panNumber: {
      type: String,
      default: null,
      trim: true,
    },

    // BUSINESS PROFILE

    productCategories: {
      type: [String],
      enum: [
        "Home Appliances",
        "Kitchen Appliances",
        "Electronics",
        "Electrical Products",
        "Consumer Durables",
        "Others",
      ],
      default: null,
    },

    otherCategory: {
      type: String,
      default: null,
      trim: true,
    },

    brandsSold: {
      type: String,
      default: null,
      trim: true,
    },

    experience: {
      type: String,
      enum: [
        "Less than 1 Year",
        "1-3 Years",
        "3-5 Years",
        "5-10 Years",
        "More than 10 Years",
      ],
      default: null,
    },

    monthlyTurnover: {
      type: String,
      enum: [
        "Below 2 Lakhs",
        "2-5 Lakhs",
        "5-10 Lakhs",
        "Above 10 Lakhs",
      ],
      default: null,
    },

    // SHOP DETAILS

    shopOwnership: {
      type: String,
      enum: ["Owned", "Rented"],
      default: null,
    },

    shopArea: {
      type: String,
      default: null,
      trim: true,
    },

    salesStaff: {
      type: Number,
      min: 0,
      default: null,
    },

    homeDelivery: {
      type: String,
      enum: ["Yes", "No"],
      default: null,
    },

    interestedCategories: {
      type: [String],
      enum: [
        "Mixer Grinder",
        "Induction Cooktop",
        "Electric Iron",
        "Fans",
        "Water Heater",
        "Chimney",
        "Hob",
        "Kitchen Appliances",
        "Other Home Appliances",
      ],
      default: null,
    },

    expectedPurchase: {
      type: String,
      enum: [
        "Below 1 Lakh",
        "1-3 Lakhs",
        "3-5 Lakhs",
        "Above 5 Lakhs",
      ],
      default: null,
    },

    // DOCUMENTS

    documentSnapshot: {
      type: [documentSnapshotSchema],
      default: null,
    },

    // ADDITIONAL INFORMATION

    reason: {
      type: String,
      default: null,
      trim: true,
    },

    additionalInfo: {
      type: String,
      default: null,
      trim: true,
    },

    // APPLICATION STATUS

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const authorizeDealer = mongoose.model(
  "authorizeDealer",
  authorizeDealerSchema
);

module.exports = authorizeDealer;
