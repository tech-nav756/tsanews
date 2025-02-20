// routes/admin/confession.js
const express = require('express');
const Confession = require('../../models/Confession');
const { isAdmin } = require('../../middleware/authMiddleware'); // Assuming you have middleware for admin check
const router = express.Router();

// VIEW All Confessions Pending Approval (Admin Route)
router.get('/confessions', isAdmin, async (req, res) => {
    try {
        const confessions = await Confession.find({ approved: false });
        res.render('pages/admin/manageConfession', { confessions });
    } catch (error) {
        res.status(500).send('Error fetching confessions');
    }
});

// APPROVE Confession (Admin Route)
router.post('/confessions/:id/approve', isAdmin, async (req, res) => {
    try {
        const confession = await Confession.findByIdAndUpdate(req.params.id, { approved: true });
        res.redirect('/admin/confessions'); // Redirect to manageConfession page
    } catch (error) {
        res.status(500).send('Error approving confession');
    }
});

// REJECT Confession (Admin Route)
router.post('/confessions/:id/reject', isAdmin, async (req, res) => {
    try {
        await Confession.findByIdAndDelete(req.params.id);
        res.redirect('/admin/confessions'); // Redirect to manageConfession page
    } catch (error) {
        res.status(500).send('Error rejecting confession');
    }
});

module.exports = router;
