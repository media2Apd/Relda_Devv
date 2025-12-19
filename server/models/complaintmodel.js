// models/complaintmodel.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  orderID: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  purchaseDate: { type: String, required: true  },
  deliveryDate: { type: String, required: true },
  complaintText: { type: String, required: true  },
  fileData: { type: Buffer, required: true },
  fileType: { type: String, required: true }
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
