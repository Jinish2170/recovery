const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const centerController = require('./controllers/centerController');
const userController = require('./controllers/userController');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Treatment Center Routes
app.get('/api/centers', centerController.getAllCenters);
app.get('/api/centers/:id', centerController.getCenterById);

// Authentication Routes
app.post('/api/auth/register', userController.register);
app.post('/api/auth/login', userController.login);

// Protected Routes
app.post('/api/centers/:id/reviews', authenticateToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const center_id = req.params.id;
        const user_id = req.user.user_id;

        const [result] = await db.query(
            'INSERT INTO reviews (center_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [center_id, user_id, rating, comment]
        );

        res.status(201).json({ success: true, data: { review_id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Additional Treatment Center Routes
app.post('/api/centers', authenticateToken, centerController.createCenter);
app.put('/api/centers/:id', authenticateToken, centerController.updateCenter);
app.delete('/api/centers/:id', authenticateToken, centerController.deleteCenter);

// Additional User Routes
app.get('/api/users/profile', authenticateToken, userController.getProfile);
app.put('/api/users/profile', authenticateToken, userController.updateProfile);

// Favorites Routes
app.post('/api/favorites/:centerId', authenticateToken, userController.addFavorite);
app.delete('/api/favorites/:centerId', authenticateToken, userController.removeFavorite);
app.get('/api/favorites', authenticateToken, userController.getFavorites);

// Review routes
app.post('/api/centers/:id/reviews', authenticateUser, centerController.addReview);
app.put('/api/reviews/:reviewId', authenticateUser, centerController.updateReview);
app.delete('/api/reviews/:reviewId', authenticateUser, centerController.deleteReview);
app.get('/api/centers/:id/reviews', centerController.getCenterReviews);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});