// seed.js
const mongoose = require('mongoose');
const Article = require('./models/Article');
const Confession = require('./models/Confession');
const User = require('./models/User');

// Wait for the MongoDB connection to be established
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected for seeding');

        // Add sample data after successful connection
        const sampleArticle = new Article({
            title: 'Sample Article',
            content: 'This is a sample article content.',
            author: 'Admin'
        });

        const sampleConfession = new Confession({
            content: 'This is a sample confession.',
            author: 'User'
        });

        const sampleUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        // Save sample data
        return Promise.all([
            sampleArticle.save(),
            sampleConfession.save(),
            sampleUser.save()
        ]);
    })
    .then(() => {
        console.log('Seed data added');
        mongoose.disconnect(); // Disconnect after seeding is done
    })
    .catch((err) => {
        console.error('Error seeding data:', err);
        mongoose.disconnect();
    });
