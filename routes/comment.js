const express = require('express');
const Comment = require('../models/Comment');
const router = express.Router();

// POST a comment on a confession (No login required)
router.post('/:id/comment', async (req, res) => {
    const { content, author = "Anonymous" } = req.body;  // Default to "Anonymous" if no author is provided
    const confessionId = req.params.id;

    try {
        const newComment = new Comment({ content, author, confessionId });
        await newComment.save();
        res.redirect(`/confessions/${confessionId}`); // Redirect to the confession page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error posting comment');
    }
});

module.exports = router;
