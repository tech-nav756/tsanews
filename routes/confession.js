const express = require('express');
const Confession = require('../models/Confession');
const Comment = require('../models/Comment');
const Interaction = require('../models/Interaction');
const { isAdmin } = require('../middleware/authMiddleware'); // Assuming you have admin middleware
const router = express.Router();

// Public routes for confessions

// CREATE Confession (Public)
router.post('/create', async (req, res) => {
    try {
        const confession = new Confession(req.body);
        await confession.save();
        res.status(201).json(confession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ Confessions (Only approved confessions for public)
router.get('/', async (req, res) => {
    try {
        const confessions = await Confession.find({ approved: true });
        res.json(confessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ Single Confession (Public)
router.get('/:id', async (req, res) => {
    try {
        const confession = await Confession.findById(req.params.id);
        if (!confession) {
            return res.status(404).json({ message: 'Confession not found' });
        }
        res.json(confession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a comment on a confession
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

// Admin routes for confessions

// Approve Confession (Admin only)
router.put('/:id/approve', isAdmin, async (req, res) => {
    try {
        const confession = await Confession.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!confession) {
            return res.status(404).json({ message: 'Confession not found' });
        }
        res.json(confession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE Confession (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const confession = await Confession.findByIdAndDelete(req.params.id);
        if (!confession) {
            return res.status(404).json({ message: 'Confession not found' });
        }
        res.json({ message: 'Confession deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
