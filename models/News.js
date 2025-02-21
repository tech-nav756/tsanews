// models/News.js
const mongoose = require('../config/database');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, 
    imagePath: { type: String },  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
