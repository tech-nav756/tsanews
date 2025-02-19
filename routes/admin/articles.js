const express = require('express');
const router = express.Router();
const Article = require('../../models/Article');

// GET all articles with pagination
router.get('/articles', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Default page 1
        const limit = 10;  // Number of articles per page
        const skip = (page - 1) * limit;

        const articles = await Article.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });  // Sort by newest first

        const totalArticles = await Article.countDocuments();

        res.render('pages/admin/articles', {
            articles,
            currentPage: page,
            totalPages: Math.ceil(totalArticles / limit),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET a specific article for editing
router.get('/articles/edit/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.render('pages/admin/edit-article', { article });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST (create) a new article
router.post('/articles', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newArticle = new Article({ title, content, author });
        await newArticle.save();
        res.redirect('/admin/articles');  // Redirect to article list
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// PUT (update) an article
router.post('/articles/edit/:id', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        await Article.findByIdAndUpdate(req.params.id, {
            title,
            content,
            author,
            updatedAt: Date.now()
        });
        res.redirect('/admin/articles');  // Redirect to article list
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE an article
router.get('/articles/delete/:id', async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.redirect('/admin/articles');  // Redirect to article list
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
