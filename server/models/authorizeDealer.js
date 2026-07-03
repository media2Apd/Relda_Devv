const mongoose = require("mongoose");

const documentSnapshotSchema = new mongoose.Schema({
  shopFrontPhoto: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  },
  shopInteriorPhoto: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  },
  gstCertificate: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  },
  visitingCard: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  }
}, { _id: false });

const authorizeDealerSchema = new mongoose.Schema(
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

    // SECTION 2 - BUSINESS DETAILS
    businessType: {
      type: String,
      enum: ["Proprietorship", "Partnership", "Private Limited", "LLP", "Other"],
      required: [true, "Business type is required"]
    },
    establishmentYear: {
      type: String,
      required: [true, "Year of establishment is required"]
    },
    gstNumber: {
      type: String,
      required: [true, "GST number is required"],
      trim: true
    },
    panNumber: {
      type: String,
      trim: true
    },

    // SECTION 3 - BUSINESS PROFILE
    productCategories: {
      type: [String],
      enum: [
        "Home Appliances",
        "Kitchen Appliances",
        "Electronics",
        "Electrical Products",
        "Consumer Durables",
        "Others"
      ]
    },
    otherCategory: {
      type: String,
      trim: true
    },
    brandsSold: {
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
    monthlyTurnover: {
      type: String,
      enum: [
        "Below 2 Lakhs",
        "2-5 Lakhs",
        "5-10 Lakhs",
        "Above 10 Lakhs"
      ]
    },

    // SECTION 4 - SHOP DETAILS
    shopOwnership: {
      type: String,
      enum: ["Owned", "Rented"]
    },
    shopArea: {
      type: String,
      trim: true
    },
    salesStaff: {
      type: Number,
      min: 0
    },
    homeDelivery: {
      type: String,
      enum: ["Yes", "No"]
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
        "Other Home Appliances"
      ]
    },
    expectedPurchase: {
      type: String,
      enum: [
        "Below 1 Lakh",
        "1-3 Lakhs",
        "3-5 Lakhs",
        "Above 5 Lakhs"
      ]
    },

    // SECTION 5 - DOCUMENTS
    documentSnapshot: [documentSnapshotSchema],

    // SECTION 6 - ADDITIONAL INFORMATION
    reason: {
      type: String,
      trim: true
    },
    additionalInfo: {
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

const authorizeDealer = mongoose.model("authorizeDealer", authorizeDealerSchema);

module.exports = authorizeDealer;