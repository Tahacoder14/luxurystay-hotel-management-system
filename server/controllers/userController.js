import User from '../models/User.js';

/**
 * @desc    Admin creates a new staff member
 * @route   POST /api/users/staff
 * @access  Private/Admin
 */
export const createStaff = async (req, res, next) => {
    const { name, email, password, role, title, department } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            // Send a clear error if the email is already in use
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        
        // We pass the plain text password. The 'pre-save' hook in the User model will hash it automatically.
        const newUser = new User({
            name,
            email,
            password,
            role, // Should be 'Manager', 'Receptionist', etc. from the admin form
            staffDetails: {
                title,
                department,
                hireDate: new Date()
            }
        });

        const savedUser = await newUser.save();

        // Very important: Never send the password back in the response.
        savedUser.password = undefined;

        res.status(201).json(savedUser);
    } catch (error) {
        // Pass any validation or server errors to the central error handler
        next(error);
    }
};

/**
 * @desc    Get all staff members
 * @route   GET /api/users/staff
 * @access  Private/Admin
 */
export const getStaff = async (req, res, next) => {
    try {
        // Find all users whose role is NOT 'Guest'. This is the correct logic.
        const staff = await User.find({ role: { $ne: 'Guest' } }).select('-password');
        res.json(staff);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all guest profiles
 * @route   GET /api/users/guests
 * @access  Private/Admin
 */
export const getGuests = async (req, res, next) => {
    try {
        // Find all users whose role is specifically 'Guest'.
        const guests = await User.find({ role: 'Guest' }).select('-password');
        res.json(guests);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a user's status (Activate/Deactivate)
 * @route   PUT /api/users/:id/status
 * @access  Private/Admin
 */
export const updateUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.isActive = req.body.isActive;
            await user.save();
            res.json({ message: `User status updated to ${user.isActive ? 'Active' : 'Deactivated'}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.role = req.body.role; // Expecting a string like 'Manager', 'Receptionist', etc.
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
    try {
        // Prevent an admin from deleting their own account
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: 'Error: Admins cannot delete their own account.' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User removed successfully.' });
    } catch (error) {
        next(error);
    }
};