import jwt  from 'jsonwebtoken';
import User  from '../models/User.js';

// This middleware checks if the user is logged in
export const protect = async (req, res, next) => {
    let token;

    if (req.header('x-auth-token')) {
        token = req.header('x-auth-token');
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.user.id).select('-password');
        if (!req.user) {
             return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        console.log('Authorization successful for user:', req.user.email, 'Role:', req.user.role);
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// This middleware checks if the user is an Admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') next();
    else res.status(403).json({ message: 'Not authorized as an admin' });
};

// ---This is for ANY staff member (including Admin) ---
export const staff = (req, res, next) => {
    if (req.user && req.user.role !== 'Guest') next();
    else res.status(403).json({ message: 'Not authorized as a staff member' });
};