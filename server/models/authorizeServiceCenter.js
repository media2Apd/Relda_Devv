
const mongoose = require("mongoose");

const documentSnapshotSchema = new mongoose.Schema({
  serviceCenterPhotos: {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    type: { type: String, default: null }
  }
}, { _id: false });

const serviceCenterSchema = new mongoose.Schema(
  {
    // Initial Website Form Fields
    serviceCenterName: {
      type: String,
      required: [true, "Service center name is required"],
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
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
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

    // Additional Information (Admin Update)
    whatsapp: { type: String, default: null, trim: true },
    address: { type: String, default: null, trim: true },
    district: { type: String, default: null, trim: true },
    gstNumber: { type: String, default: null, trim: true },
    establishmentYear: { type: String, default: null, trim: true },

    technicians: {
      type: String,
      enum: ["1-2", "3-5", "6-10", "Above 10"],
      default: null
    },

    productCategories: {
      type: [String],
      enum: [
        "Mixer Grinder",
        "Induction Cooktop",
        "Electric Iron",
        "Fans",
        "Water Heater",
        "Chimney",
        "Hob",
        "Small Home Appliances",
        "Others"
      ],
      default: null
    },

    otherCategory: { type: String, default: null, trim: true },
    existingBrands: { type: String, default: null, trim: true },

    warrantyService: {
      type: String,
      enum: ["Yes", "No"],
      default: null
    },
    inShopService: {
      type: String,
      enum: ["Yes", "No"],
      default: null
    },
    pickupDelivery: {
      type: String,
      enum: ["Yes", "No"],
      default: null
    },

    serviceAreas: { type: String, default: null, trim: true },

    documentSnapshot: {
      type: [documentSnapshotSchema],
      default: null
    },

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

const authorizeServiceCenter = mongoose.model(
  "authorizeServiceCenter",
  serviceCenterSchema
);

module.exports = authorizeServiceCenter;
