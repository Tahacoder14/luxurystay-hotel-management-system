const Update = require('../models/Update');

// @desc    Admin creates a new daily update
exports.createUpdate = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const update = new Update({ title, content, author: req.user.id });
        await update.save();
        res.status(201).json(update);
    } catch (error) { next(error); }
};

// @desc    Any staff member can get all updates
exports.getAllUpdates = async (req, res, next) => {
    try {
        const updates = await Update.find({}).populate('author', 'name').sort({ createdAt: -1 });
        res.json(updates);
    } catch (error) { next(error); }
};