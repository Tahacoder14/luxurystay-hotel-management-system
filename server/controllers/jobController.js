import Job from '../models/job.js';

// @desc    Get all jobs
export const getAllJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new job (Admin only)
export const createJob = async (req, res, next) => {
    try {
        const newJob = new Job(req.body);
        const job = await newJob.save();
        res.status(201).json(job);
    } catch (error) {
        next(error);
    }
};
// Add update and delete functions here later
// @desc    Update a job (Admin only)
export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a job (Admin only)
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        next(error);
    }
};