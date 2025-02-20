// routes/interaction.js
const express = require('express');
const Interaction = require('../models/Interaction');
const Confession = require('../models/Confession'); // for checking if confession exists
const router = express.Router();

// Like or Dislike Confession
router.post('/:confessionId/interaction', async (req, res) => {
    const { type } = req.body; // 'like' or 'dislike'
    const confessionId = req.params.confessionId;

    try {
        // Check if the confession exists
        const confession = await Confession.findById(confessionId);
        if (!confession) {
            return res.status(404).send('Confession not found');
        }

        // Prevent multiple interactions from the same user (Optional)
        // Assuming you have session data or user info
        const userId = req.session.user ? req.session.user._id : 'anonymous';  // For now, we'll assume anonymous interactions

        // Check if this user has already interacted with this confession
        const existingInteraction = await Interaction.findOne({ userId, confessionId });
        if (existingInteraction) {
            return res.status(400).send('You have already interacted with this confession');
        }

        // Create the interaction
        const newInteraction = new Interaction({
            userId,
            confessionId,
            type
        });
        await newInteraction.save();

        res.redirect(`/confessions/${confessionId}`); // Redirect back to the confession details page
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing interaction');
    }
});

module.exports = router;
