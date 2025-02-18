// middleware/authMiddleware.js
module.exports = {
    isAdmin: (req, res, next) => {
        if (req.session.role !== 'admin') {
            return res.status(403).send('Forbidden');
        }
        next(); // Proceed to the next middleware/route handler
    },
    isAuthenticated: (req, res, next) => {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
        next();
    }
};
