const express = require('express');
const { isAdmin } = require('../../middleware/authMiddleware'); // Admin middleware
const Confession = require('../../models/Confession'); // Confession model
const router = express.Router();

// View all confessions pending approval
router.get('/confessions', isAdmin, async (req, res) => {
    try {
        const confessions = await Confession.find({ approved: false });
        res.render('pages/admin/confessions', { confessions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching confessions');
    }
});

// Approve confession
router.post('/confessions/:id/approve', isAdmin, async (req, res) => {
    try {
        await Confession.findByIdAndUpdate(req.params.id, { approved: true });
        res.redirect('/admin/confessions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error approving confession');
    }
});

// Reject confession
router.post('/confessions/:id/reject', isAdmin, async (req, res) => {
    try {
        await Confession.findByIdAndDelete(req.params.id);
        res.redirect('/admin/confessions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rejecting confession');
    }
});

module.exports = router;
