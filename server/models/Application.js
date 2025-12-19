const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  gstNumber: { type: String, required: true },
  panNumber: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  fileData: { type: Buffer, required: true }, // Ensure this is defined correctly
  fileType: { type: String, required: true }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
