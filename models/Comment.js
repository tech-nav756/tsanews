// models/Comment.js
const mongoose = require('../config/database');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    confession: { type: mongoose.Schema.Types.ObjectId, ref: 'Confession' },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
