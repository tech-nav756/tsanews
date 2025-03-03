// models/Article.js
const mongoose = require('../config/database');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    image: { type: String } 
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
