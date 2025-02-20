const express = require('express');
const News = require('../../models/News');
const router = express.Router();

// Admin manage articles
router.get('/manageArticles', async (req, res) => {
  try {
    const articles = await News.find();
    res.render('pages/admin/manageArticle', { articles }); // Render manageArticle.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching articles');
  }
});

// Route for Edit Article (Show edit form)
router.get('/edit-article/:id', async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }
    res.render('pages/admin/edit-article', { article });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching article');
  }
});

// Route for Handling Edit Article Form Submission
router.post('/edit-article/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    await News.findByIdAndUpdate(req.params.id, { title, content });
    res.redirect('/admin/manageArticles'); // Redirect back to manage articles
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating article');
  }
});

// Route for Delete Article (Show delete confirmation)
router.get('/delete-article/:id', async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }
    res.render('pages/admin/delete-article', { article });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching article');
  }
});

// Route for Handling Delete Article
router.post('/delete-article/:id', async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.redirect('/admin/manageArticles'); // Redirect back to manage articles
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting article');
  }
});

module.exports = router;
