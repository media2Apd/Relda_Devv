const mongoose = require('mongoose')



const registrationSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    orderNumber: String,
    serialNumber: String,
    installationDate: Date,
    // fileData: Buffer,
    // fileUpload: String, // To store the file path
    fileUpload: String,
fileUrl: String, // Store Cloudinary URL
  });
  
  const Registration = mongoose.model('Registration', registrationSchema);
  module.exports = Registration;