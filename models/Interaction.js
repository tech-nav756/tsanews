// models/Interaction.js
const mongoose = require('../config/database');

const interactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    confessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Confession' },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    type: { type: String, enum: ['like', 'dislike'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
