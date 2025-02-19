const mongoose = require('../config/database');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    confessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Confession', required: true },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
