// routes/interaction.js
const express = require('express');
const router = express.Router();
const Confession = require('../models/Confession');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Interaction = require('../models/Interaction');

// POST comment on a confession
router.post('/confessions/:id/comment', async (req, res) => {
    const { content, author } = req.body;
    const confessionId = req.params.id;

    try {
        const newComment = new Comment({ content, author, confessionId });
        await newComment.save();
        res.redirect(`/confessions/${confessionId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error posting comment');
    }
});

// POST comment on a news article
router.post('/articles/:id/comment', async (req, res) => {
    const { content, author } = req.body;
    const articleId = req.params.id;

    try {
        const newComment = new Comment({ content, author, articleId });
        await newComment.save();
        res.redirect(`/articles/${articleId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error posting comment');
    }
});

// Like or Dislike a confession
router.post('/confessions/:id/interaction', async (req, res) => {
    const { type } = req.body; // 'like' or 'dislike'
    const confessionId = req.params.id;
    const userId = req.session.user._id; // Assuming user is logged in

    try {
        const existingInteraction = await Interaction.findOne({ userId, confessionId });
        if (existingInteraction) {
            return res.status(400).send('You have already interacted with this confession');
        }

        const newInteraction = new Interaction({ userId, confessionId, type });
        await newInteraction.save();
        res.redirect(`/confessions/${confessionId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding interaction');
    }
});

// Like or Dislike a news article
router.post('/articles/:id/interaction', async (req, res) => {
    const { type } = req.body; // 'like' or 'dislike'
    const articleId = req.params.id;
    const userId = req.session.user._id; // Assuming user is logged in

    try {
        const existingInteraction = await Interaction.findOne({ userId, articleId });
        if (existingInteraction) {
            return res.status(400).send('You have already interacted with this article');
        }

        const newInteraction = new Interaction({ userId, articleId, type });
        await newInteraction.save();
        res.redirect(`/articles/${articleId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding interaction');
    }
});

module.exports = router;
