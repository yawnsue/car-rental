const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    dailyRate: { type: Number, required: true },
    imageUrl: { type: String }, // For the grade-safe photos
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }] // Many-to-Many link
});
module.exports = mongoose.model('Vehicle', vehicleSchema);