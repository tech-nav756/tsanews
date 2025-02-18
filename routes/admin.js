// routes/admin.js
const express = require('express');
const { isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin Dashboard Route (GET)
router.get('/dashboard', isAdmin, (req, res) => {
    res.render('pages/admin/dashboard'); // This page can be customized later
});

module.exports = router;
