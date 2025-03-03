// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts'); // Import express-ejs-layouts
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/index');
const articleRoutes = require('./routes/admin/articles');  // Import articles routes
const confessionRoutes = require('./routes/confession'); // Import confession routes
const adminConfessionRoutes = require('./routes/admin/confession'); // Import admin confession routes
const commentRoutes = require('./routes/comment');
const interactionRoutes = require('./routes/interaction');
require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'yourSecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Should be true if you're using HTTPS
}));

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); // Admin panel route
app.use('/admin', articleRoutes); // Admin panel route
app.use('/admin', adminConfessionRoutes);
app.use('/confessions', confessionRoutes);
app.use('/confessions', commentRoutes);  // Add comment route here
app.use('/confessions', interactionRoutes);  // Add interaction route here



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
