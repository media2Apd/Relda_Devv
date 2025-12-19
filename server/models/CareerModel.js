// models/JobApplication.js
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  educationalQualification: { type: String, required: true },
  lookingFor: { type: String, required: true },
  experience: { type: String, required: true },
  phone: { type: String, required: true },
  summary: { type: String },
  fileData: { type: Buffer, required: true }, // Ensure this is defined correctly
  fileType: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
