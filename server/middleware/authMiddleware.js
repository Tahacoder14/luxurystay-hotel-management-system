const jwt = require('jsonwebtoken');
const User = require('../models/User'); // It's good practice to ensure the user still exists

// This middleware checks if the user is logged in
const protect = async (req, res, next) => {
    let token;

    if (req.header('x-auth-token')) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // --- THE CRITICAL FIX ---
        // The payload we created was { user: { id: ..., role: ... } }
        // So, decoded.user contains the user info.
        // We also check if the user still exists in the database.
        req.user = await User.findById(decoded.user.id).select('-password');
        
        if (!req.user) {
             return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        
        // This log will show in your backend terminal. It's great for debugging!
        console.log('Authorization successful for user:', req.user.email, 'Role:', req.user.role);

        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// This middleware checks if the user is an Admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') next();
    else res.status(403).json({ message: 'Not authorized as an admin' });
};

// ---This is for ANY staff member (including Admin) ---
const staff = (req, res, next) => {
    if (req.user && req.user.role !== 'Guest') next();
    else res.status(403).json({ message: 'Not authorized as a staff member' });
};

module.exports = { protect, admin, staff };