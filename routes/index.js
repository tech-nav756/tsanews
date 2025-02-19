// routes/index.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Confession = require('../models/Confession');

// Home route - Display Trending News
router.get('/', async (req, res) => {
    try {
        // Fetch the top 5 trending news articles based on likes or comments
        const trendingNews = await News.find().sort({ commentsCount: -1 }).limit(5);

        // Render home.ejs with trending news
        res.render('pages/home', { trendingNews });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching trending news');
    }
});

// About Page Route
router.get('/about', (req, res) => {
    res.render('pages/about');  // Render about.ejs page
});

// News Articles CRUD Routes

// Create News Article (Admin Only)
router.post('/news', (req, res) => {
    const { title, content } = req.body;
    const newArticle = new News({ title, content });
    newArticle.save()
        .then(() => res.redirect('/news'))
        .catch((err) => res.status(500).send(err));
});

// Read All News Articles (Magazine Page with Pagination)
router.get('/magazine', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = 5;  // Number of articles per page
        const skip = (page - 1) * limit;

        // Fetch articles with pagination
        const articles = await News.find().skip(skip).limit(limit);
        const totalArticles = await News.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalArticles / limit);

        res.render('pages/magazine', {
            articles,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching articles');
    }
});

// News View for Individual Article
router.get('/news/:id', async (req, res) => {
    try {
        const article = await News.findById(req.params.id);

        if (!article) {
            return res.status(404).send('News article not found');
        }

        res.render('pages/newsView', { article });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching news article');
    }
});

// Update News Article (Admin Only)
router.put('/news/:id', (req, res) => {
    const { title, content } = req.body;
    News.findByIdAndUpdate(req.params.id, { title, content }, { new: true })
        .then(() => res.redirect(`/news/${req.params.id}`))
        .catch((err) => res.status(500).send(err));
});

// Delete News Article (Admin Only)
router.delete('/news/:id', (req, res) => {
    News.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/news'))
        .catch((err) => res.status(500).send(err));
});

// Confession CRUD Routes

// Show confession form
router.get('/confess', (req, res) => {
    res.render('pages/confess');  // Confession form page
});

// Handle confession form submission
router.post('/confess', async (req, res) => {
    const { content, author } = req.body;

    try {
        const newConfession = new Confession({ content, author });
        await newConfession.save();
        res.redirect('/');  // Redirect after successful submission
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting confession');
    }
});

// Show all approved confessions with pagination
router.get('/confessions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = 5;  // Number of confessions per page
        const skip = (page - 1) * limit;

        // Fetch approved confessions with pagination
        const confessions = await Confession.find({ approved: true })
            .skip(skip)
            .limit(limit);

        const totalConfessions = await Confession.countDocuments({ approved: true });

        // Calculate total pages
        const totalPages = Math.ceil(totalConfessions / limit);

        res.render('pages/confessions', {
            confessions,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching confessions');
    }
});

// Admin Approve Confession
router.post('/approve-confession/:id', (req, res) => {
    Confession.findByIdAndUpdate(req.params.id, { approved: true })
        .then(() => res.redirect('/confessions'))
        .catch((err) => res.status(500).send(err));
});

// Delete Confession (Admin Only)
router.delete('/confessions/:id', (req, res) => {
    Confession.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/confessions'))
        .catch((err) => res.status(500).send(err));
});

// Trending News with Pagination
router.get('/trending', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = 5;  // Number of articles per page
        const skip = (page - 1) * limit;

        // Fetch trending news articles based on the number of comments or likes
        const trendingNews = await News.find().sort({ commentsCount: -1 }).skip(skip).limit(limit);
        const totalTrendingNews = await News.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalTrendingNews / limit);

        res.render('pages/trending', {
            trendingNews,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching trending news');
    }
});

module.exports = router;
