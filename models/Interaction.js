// models/Interaction.js
const mongoose = require('../config/database');

const interactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Optional if you are tracking users
    confessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Confession', required: true },
    type: { type: String, enum: ['like', 'dislike'], required: true }, // 'like' or 'dislike'
    createdAt: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
