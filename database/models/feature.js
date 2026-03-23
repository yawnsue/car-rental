const mongoose = require('mongoose');
const featureSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    dailyPrice: { type: Number, required: true, default: 0 }
});
module.exports = mongoose.model('Feature', featureSchema);