const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        
        // Check if user exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword]
        );

        const token = jwt.sign(
            { user_id: result.insertId, email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            data: {
                user_id: result.insertId,
                first_name,
                last_name,
                email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users.length) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            data: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, first_name, last_name, email, created_at FROM users WHERE user_id = ?',
            [req.user.user_id]
        );
        
        if (!users.length) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: users[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, email } = req.body;

        if (email) {
            const [existingUsers] = await db.query(
                'SELECT * FROM users WHERE email = ? AND user_id != ?',
                [email, req.user.user_id]
            );
            if (existingUsers.length) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
        }

        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?',
            [first_name, last_name, email, req.user.user_id]
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add a center to favorites
exports.addFavorite = async (req, res) => {
    try {
        const centerId = req.params.centerId;
        const userId = req.user.user_id;

        // Check if center exists
        const [centers] = await db.query('SELECT * FROM treatment_centers WHERE center_id = ?', [centerId]);
        if (!centers.length) {
            return res.status(404).json({ success: false, message: 'Treatment center not found' });
        }

        // Create favorites table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_favorites (
                user_id INT,
                center_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, center_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id),
                FOREIGN KEY (center_id) REFERENCES treatment_centers(center_id)
            )
        `);

        // Add to favorites
        await db.query(
            'INSERT IGNORE INTO user_favorites (user_id, center_id) VALUES (?, ?)',
            [userId, centerId]
        );

        res.json({ success: true, message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove a center from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const centerId = req.params.centerId;
        const userId = req.user.user_id;

        await db.query(
            'DELETE FROM user_favorites WHERE user_id = ? AND center_id = ?',
            [userId, centerId]
        );

        res.json({ success: true, message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user's favorite centers
exports.getFavorites = async (req, res) => {
    try {
        const [favorites] = await db.query(`
            SELECT tc.* 
            FROM treatment_centers tc
            INNER JOIN user_favorites uf ON tc.center_id = uf.center_id
            WHERE uf.user_id = ?
        `, [req.user.user_id]);

        res.json({ success: true, data: favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};