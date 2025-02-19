// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin'); // Import your Admin model
const { isAuthenticated } = require('../middleware/authMiddleware'); // Middleware for authentication
const router = express.Router();

// Admin Login - GET Route
router.get('/login', (req, res) => {
  res.render('pages/admin/login'); // Render the login page (inside views/pages/admin)
});

// Admin Login - POST Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).send('Invalid username or password');
    }

    // Check if the password matches
    const isMatch = await admin.matchPassword(password); // Use the matchPassword method
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    // If login is successful, store admin session
    req.session.userId = admin._id;
    req.session.username = admin.username;
    req.session.role = 'admin';

    // Redirect to admin dashboard
    res.redirect('/admin/dashboard'); // Corrected the redirect path to /admin/dashboard
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Admin Dashboard - Protected Route (GET)
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('pages/admin/dashboard'); // Render the admin dashboard (inside views/pages/admin)
});

module.exports = router;
