const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

const UserSchema = new mongoose.Schema({
    uniqueId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Guest', 'Receptionist', 'Housekeeping', 'Laundry', 'Manager', 'Admin'], default: 'Guest' },
    staffDetails: { title: { type: String }, hireDate: { type: Date }, department: { type: String } },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// --- THE DEFINITIVE & SECURE "PRE-SAVE" HOOK ---
// This professional hook runs automatically before a user document is saved.
UserSchema.pre('save', async function(next) {
    // Generate a Unique ID only for new users
    if (this.isNew) {
        let prefix = this.role === 'Guest' ? 'GUEST-' : 'STAFF-';
        if (this.role === 'Admin') prefix = 'ADMIN-';
        this.uniqueId = prefix + nanoid(8).toUpperCase();
    }

    // Hash the password ONLY if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);