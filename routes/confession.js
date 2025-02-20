const express = require('express');
const Confession = require('../models/Confession');
const Comment = require('../models/Comment');
const Interaction = require('../models/Interaction');
const router = express.Router();

// CREATE Confession (Public Route)
router.post('/create', async (req, res) => {
    const { content, author } = req.body;

    try {
        const newConfession = new Confession({ content, author });
        await newConfession.save();
        res.status(201).json(newConfession); // Return the created confession
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// VIEW All Confessions (Public Route, approved only)
router.get('/', async (req, res) => {
    try {
        const confessions = await Confession.find({ approved: true });
        res.render('pages/confess', { confessions }); // Render the confession list
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// VIEW Single Confession (Public Route)
router.get('/:id', async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        if (!confession) {
            return res.status(404).json({ message: 'Confession not found' });
        }

        // Fetch comments for the confession
        const comments = await Comment.find({ confessionId: req.params.id });

        // Fetch likes and dislikes for the confession
        const likesCount = await Interaction.countDocuments({ confessionId: req.params.id, type: 'like' });
        const dislikesCount = await Interaction.countDocuments({ confessionId: req.params.id, type: 'dislike' });

        res.render('pages/confession', { confession, comments, likesCount, dislikesCount });
    } catch (error) {
        res.status(500).send('Error fetching confession');
    }
});

// CREATE Comment on a Confession
router.post('/:id/comment', async (req, res) => {
    const { content, author } = req.body;
    const confessionId = req.params.id;

    try {
        const newComment = new Comment({ content, author, confessionId });
        await newComment.save();
        res.redirect(`/confessions/${confessionId}`);  // Redirect back to the single confession page
    } catch (error) {
        res.status(500).send('Error posting comment');
    }
});

// LIKE or DISLIKE a Confession
router.post('/:id/interaction', async (req, res) => {
    const confessionId = req.params.id;
    const { type } = req.body;  // Either "like" or "dislike"

    try {
        const newInteraction = new Interaction({ confessionId, type });
        await newInteraction.save();
        res.redirect(`/confessions/${confessionId}`);  // Redirect back to the single confession page
    } catch (error) {
        res.status(500).send('Error processing interaction');
    }
});

module.exports = router;
