// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session'); // Import express-session
const indexRoutes = require('./routes/index'); // Import the routes
const authRoutes = require('./routes/auth'); // Import auth routes
const adminRoutes = require('./routes/admin'); // Import admin routes
require('./config/database'); // Import the database configuration

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

// Set up static file serving (CSS, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecret', // Add a secret for session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true for production with HTTPS
}));

// Use the routes from index.js, auth.js, and admin.js
app.use('/', indexRoutes); // Public-facing routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/admin', adminRoutes); // Admin panel routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
