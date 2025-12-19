const mongoose = require('mongoose');

const cookieAcceptanceSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true,
    },
    accepted: {
        type: Boolean,
        required: true,
    },
    acceptanceTimestamps: {
        type: [Date], // Array of timestamps to store each acceptance time
        default: [],
    },
    count: {
        type: Number,
        default: 0, // Initialize count
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const CookieAcceptance = mongoose.model('CookieAcceptance', cookieAcceptanceSchema);

module.exports = CookieAcceptance;