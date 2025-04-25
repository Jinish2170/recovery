const db = require('../config/database');

// Get all centers with optional filtering
exports.getAllCenters = async (req, res) => {
    try {
        const { location, type, rating } = req.query;
        let query = 'SELECT c.*, AVG(r.rating) as average_rating, COUNT(r.review_id) as review_count FROM centers c LEFT JOIN reviews r ON c.center_id = r.center_id';
        const params = [];

        if (location || type || rating) {
            query += ' WHERE';
            const conditions = [];
            
            if (location) {
                conditions.push(' c.location LIKE ?');
                params.push(`%${location}%`);
            }
            if (type) {
                conditions.push(' c.type = ?');
                params.push(type);
            }
            if (rating) {
                conditions.push(' AVG(r.rating) >= ?');
                params.push(parseFloat(rating));
            }
            
            query += conditions.join(' AND');
        }

        query += ' GROUP BY c.center_id';

        const [centers] = await db.query(query, params);
        res.json({ success: true, data: centers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get center by ID with reviews
exports.getCenterById = async (req, res) => {
    try {
        const [centers] = await db.query(
            `SELECT c.*, 
            AVG(r.rating) as average_rating, 
            COUNT(r.review_id) as review_count 
            FROM centers c 
            LEFT JOIN reviews r ON c.center_id = r.center_id 
            WHERE c.center_id = ? 
            GROUP BY c.center_id`,
            [req.params.id]
        );

        if (!centers.length) {
            return res.status(404).json({ success: false, message: 'Center not found' });
        }

        // Get reviews for the center
        const [reviews] = await db.query(
            `SELECT r.*, u.first_name, u.last_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.user_id 
            WHERE r.center_id = ? 
            ORDER BY r.created_at DESC`,
            [req.params.id]
        );

        const center = centers[0];
        center.reviews = reviews;

        res.json({ success: true, data: center });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add new center (protected route - admin only)
exports.addCenter = async (req, res) => {
    try {
        const { name, description, location, type, contact_number, email, website, amenities } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO centers (name, description, location, type, contact_number, email, website, amenities) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, location, type, contact_number, email, website, JSON.stringify(amenities)]
        );

        res.status(201).json({ success: true, data: { center_id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a review for a center
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const centerId = req.params.id;
        const userId = req.user.user_id;

        // Check if center exists
        const [centers] = await db.query('SELECT * FROM centers WHERE center_id = ?', [centerId]);
        if (!centers.length) {
            return res.status(404).json({ success: false, message: 'Center not found' });
        }

        // Check if user already reviewed this center
        const [existingReviews] = await db.query(
            'SELECT * FROM reviews WHERE user_id = ? AND center_id = ?',
            [userId, centerId]
        );

        if (existingReviews.length) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this center' });
        }

        // Add review
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, center_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, centerId, rating, comment]
        );

        res.status(201).json({ 
            success: true, 
            message: 'Review added successfully',
            data: { review_id: result.insertId }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a review
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = req.params.reviewId;
        const userId = req.user.user_id;

        // Check if review exists and belongs to user
        const [reviews] = await db.query(
            'SELECT * FROM reviews WHERE review_id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (!reviews.length) {
            return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
        }

        // Update review
        await db.query(
            'UPDATE reviews SET rating = ?, comment = ? WHERE review_id = ?',
            [rating, comment, reviewId]
        );

        res.json({ success: true, message: 'Review updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.user_id;

        // Check if review exists and belongs to user
        const [reviews] = await db.query(
            'SELECT * FROM reviews WHERE review_id = ? AND user_id = ?',
            [reviewId, userId]
        );

        if (!reviews.length) {
            return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
        }

        // Delete review
        await db.query('DELETE FROM reviews WHERE review_id = ?', [reviewId]);

        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get reviews for a center
exports.getCenterReviews = async (req, res) => {
    try {
        const centerId = req.params.id;
        
        const [reviews] = await db.query(`
            SELECT r.*, u.first_name, u.last_name 
            FROM reviews r 
            JOIN users u ON r.user_id = u.user_id 
            WHERE r.center_id = ? 
            ORDER BY r.created_at DESC`,
            [centerId]
        );

        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};