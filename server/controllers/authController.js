const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
exports.registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // --- CRITICAL: We pass the PLAIN TEXT password to the new User. ---
        // The pre-save hook in the User.js model will handle the hashing automatically and securely.
        const user = new User({ name, email, password });
        await user.save();
        
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token (Login)
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find the user by their email address in the database.
        const user = await User.findOne({ email });
        
        // If no user is found OR if the password comparison fails, send the same generic error.
        // This is a security best practice to prevent "user enumeration attacks".
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If the user is found and the password is correct, create and send the token.
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (error) {
        next(error);
    }
};