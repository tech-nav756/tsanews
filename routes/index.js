// routes/index.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');
const Confession = require('../models/Confession');

// Home route
router.get('/', (req, res) => {
    res.render('pages/home'); // Renders the home.ejs page
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

// Read News Articles
router.get('/news', (req, res) => {
    News.find()
        .then((articles) => res.render('pages/news', { articles }))
        .catch((err) => res.status(500).send(err));
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

// Create Confession
router.post('/confessions', (req, res) => {
    const { content, author } = req.body;
    const newConfession = new Confession({ content, author });
    newConfession.save()
        .then(() => res.redirect('/confessions'))
        .catch((err) => res.status(500).send(err));
});

// Read Confessions
router.get('/confessions', (req, res) => {
    Confession.find({ approved: true })
        .then((confessions) => res.render('pages/confessions', { confessions }))
        .catch((err) => res.status(500).send(err));
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

module.exports = router;
