// models/News.js

const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: String,
    content: String,
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const News = mongoose.model('News', NewsSchema);
module.exports = News;
