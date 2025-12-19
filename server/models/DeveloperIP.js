// models/DeveloperIP.js
const mongoose = require('mongoose');

const developerIPSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model('DeveloperIP', developerIPSchema);
