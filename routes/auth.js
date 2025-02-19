const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /auth/login - Login Page
router.get('/login', (req, res) => {
    res.render('pages/login'); // Render login page (use EJS template)
});

// POST /auth/login - Handle Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (admin) {
            const isMatch = await admin.matchPassword(password);
            if (!isMatch) {
                return res.status(401).send('Invalid username or password');
            }

            // Admin login: create session and redirect
            req.session.userId = admin._id;
            req.session.username = admin.username;
            req.session.role = 'admin';  // Admin role for access control
            return res.redirect('/admin/dashboard');
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (user) {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).send('Invalid username or password');
            }

            // User login: create session and redirect
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.role = 'user';  // User role for access control
            return res.redirect('/');
        }

        return res.status(401).send('Invalid username or password');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// GET /auth/logout - Logout logic
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/auth/login');  // Redirect to login page
    });
});

module.exports = router;
