// routes/admin.js
const express = require('express');
const bcrypt = require('bcryptjs');
const News = require('../../models/News');
const Confession = require('../../models/Confession');
const articleRoutes = require('./articles');  // Import the article routes
const Admin = require('../../models/Admin'); // Import your Admin model
const { isAuthenticated } = require('../../middleware/authMiddleware'); // Middleware for authentication
const router = express.Router();

router.use('/articles', articleRoutes);

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


// Manage Articles (Admin)
router.get('/manageArticles', async (req, res) => {
  try {
      const articles = await News.find();
      res.render('pages/admin/manageArticle', { articles }); // Render manageArticle.ejs
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching articles');
  }
});

// Manage Confessions (Admin)
router.get('/manageConfessions', async (req, res) => {
  try {
      const confessions = await Confession.find();
      res.render('pages/admin/manageConfession', { confessions }); // Render manageConfession.ejs
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching confessions');
  }
});

// Create Article (Admin)
router.get('/createArticle', (req, res) => {
  res.render('pages/admin/createArticle'); // Render createArticle.ejs
});

// Send Email (Admin)
router.get('/sendEmail', (req, res) => {
  res.render('pages/admin/sendEmail'); // Render sendEmail.ejs
});

// Create New Article (Handle Form Submission)
router.post('/createArticle', async (req, res) => {
  const { title, content } = req.body;
  const newArticle = new News({ title, content });
  try {
      await newArticle.save();
      res.redirect('/admin/manageArticles'); // Redirect to manage articles after successful creation
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating article');
  }
});

// Update Article (Admin)
router.get('/updateArticle/:id', async (req, res) => {
  try {
      const article = await News.findById(req.params.id);
      if (!article) {
          return res.status(404).send('Article not found');
      }
      res.render('pages/admin/updateArticle', { article });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching article for update');
  }
});


router.get('/news', async (req, res) => {
  try {
      const articles = await News.find();  // Fetch all articles
      res.render('pages/admin/manageArticle', { articles }); // Assuming the admin view is at /views/pages/admin/manageArticle.ejs
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching news articles');
  }
});

// Route to show the form for creating a new article
router.get('/news/create', (req, res) => {
  res.render('pages/admin/createArticle');  // Render the form to create a new article
});

// Handle form submission to create a new article
// Create News Article (Admin Only)
router.post('/news/create', async (req, res) => {
  const { title, content } = req.body;

  try {
      const newArticle = new News({ title, content });
      await newArticle.save();
      res.redirect('/admin/createArticle');  // Redirect to the manage articles page after creating
  } catch (error) {
      console.error(error);
      res.status(500).send('Error creating article');
  }
});

// Handle Update Article
router.post('/updateArticle/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
      await News.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
      res.redirect('/admin/manageArticles');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error updating article');
  }
});

// Delete Article (Admin)
router.delete('/deleteArticle/:id', async (req, res) => {
  try {
      await News.findByIdAndDelete(req.params.id);
      res.redirect('/admin/manageArticles');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting article');
  }
});

router.get('/logout', (req, res) => {
  // Assuming you have a session or token for authentication
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Error logging out');
      }
      res.redirect('/auth/login');
  });
});

module.exports = router;
