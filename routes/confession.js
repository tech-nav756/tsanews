const express = require('express');
const router = express.Router();
const Confession = require('../models/confession');

// CREATE Confession
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

// READ Single Confession
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

// APPROVE Confession (Admin only)
router.put('/:id/approve', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
