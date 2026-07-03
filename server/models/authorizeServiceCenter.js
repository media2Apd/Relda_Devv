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
    // Basic Information
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
      required: [true, "Complete address is required"],
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
    gstNumber: {
      type: String,
      trim: true
    },
    establishmentYear: {
      type: String,
      trim: true
    },

    // Technician Details
    technicians: {
      type: String,
      enum: ["1-2", "3-5", "6-10", "Above 10"],
      required: [true, "Number of technicians is required"]
    },

    // Service Categories
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
      required: [true, "Product categories are required"]
    },
    otherCategory: {
      type: String,
      trim: true
    },

    // Existing Brands
    existingBrands: {
      type: String,
      trim: true
    },

    // Services Offered
    warrantyService: {
      type: String,
      enum: ["Yes", "No"]
    },
    inShopService: {
      type: String,
      enum: ["Yes", "No"]
    },
    pickupDelivery: {
      type: String,
      enum: ["Yes", "No"]
    },
    serviceAreas: {
      type: String,
      trim: true
    },

    // Documents
    documentSnapshot: [documentSnapshotSchema],

    // Additional Information
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

const authorizeServiceCenter = mongoose.model("authorizeServiceCenter", serviceCenterSchema);

module.exports = authorizeServiceCenter;