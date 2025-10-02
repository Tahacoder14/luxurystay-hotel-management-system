import Submission from '../models/Submission.js';

// @desc    Create a new submission (from guest contact form)
export const createSubmission = async (req, res, next) => {
    try {
        const newSubmission = new Submission(req.body);
        await newSubmission.save();
        res.status(201).json({ message: 'Your message has been sent successfully!' });
    } catch (error) { next(error); }
};

// @desc    Get all submissions (Admin only)
export const getAllSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find().sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) { next(error); }
};

// @desc    Update a submission's status (Admin only)
export const updateSubmissionStatus = async (req, res, next) => {
    try {
        const submission = await Submission.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json(submission);
    } catch (error) { next(error); }
};

// @desc    Delete a submission (Admin only)
export const deleteSubmission = async (req, res, next) => {
    try {
        const submission = await Submission.findByIdAndDelete(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        res.json({ message: 'Submission deleted successfully.' });
    } catch (error) { next(error); }
};