const mongoose = require('../config/database');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, default: "Anonymous" },  // Default to "Anonymous" if no author is provided
    confessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Confession' },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
