const mongoose = require('mongoose');

const DealerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  GSTNumber: { type: String, required: true },
  PanNumber: { type: String, required: true },
  fileData: { type: Buffer, required: true },
  fileType: { type: String, required: true }
});

module.exports = mongoose.model('Dealer', DealerSchema);
