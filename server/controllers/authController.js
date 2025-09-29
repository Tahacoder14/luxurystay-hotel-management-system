import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const user = new User({ name, email, password });
        await user.save();
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate user & get token (Login)
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
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