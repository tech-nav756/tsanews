// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Login Route (GET)
router.get('/login', (req, res) => {
    res.render('pages/login');
});

// Login Route (POST)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).render('pages/login', { error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).render('pages/login', { error: 'Incorrect password' });
        }

        // Set user session
        req.session.userId = user._id;
        req.session.role = user.role;

        res.redirect('/admin/dashboard'); // Redirect to admin dashboard (or home for non-admin users)
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Logout Route (GET)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/');
    });
});

module.exports = router;
