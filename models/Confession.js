// models/Confession.js
const mongoose = require('../config/database');

const confessionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Confession = mongoose.model('Confession', confessionSchema);

module.exports = Confession;
