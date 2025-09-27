const Job = require('../models/Job');

// @desc    Get all jobs
exports.getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new job (Admin only)
exports.createJob = async (req, res, next) => {
    try {
        const newJob = new Job(req.body);
        const job = await newJob.save();
        res.status(201).json(job);
    } catch (error) {
        next(error);
    }
};
// Add update and delete functions here later