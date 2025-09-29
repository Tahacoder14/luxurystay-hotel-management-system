import Application from '../models/Application.js';
import User from '../models/User.js';
import Job from '../models/job.js';

/**
 * @desc    Submit a new job application
 * @route   POST /api/applications
 * @access  Public
 */
export const createApplication = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'A CV file is required.' });
        }
        const applicationData = {
            ...req.body,
            cv: req.file.buffer,           // Store the file as Buffer
            cvType: req.file.mimetype,     // Store the MIME type
            // cvPath is now optional/legacy, you can leave it out or set to null
        };
        const application = new Application(applicationData);
        await application.save();
        res.status(201).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all job applications
 * @route   GET /api/applications
 * @access  Private/Admin
 */
export const getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({}).populate('job', 'title').sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Process an application (Hire or Reject)
 * @route   PUT /api/applications/:applicationId/process
 * @access  Private/Admin
 */
export const processApplication = async (req, res, next) => {
    const { applicationId } = req.params;
    const { action, staffTitle } = req.body;

    try {
        const application = await Application.findById(applicationId).populate('job');
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        // Find the user who submitted the application
        const applicantUser = await User.findOne({ email: application.email });
        if (!applicantUser) return res.status(404).json({ message: 'Applicant user profile not found.'});

        if (action === 'hire') {
            applicantUser.role = 0;
            applicantUser.staffDetails = { title: staffTitle || application.job.title, hireDate: new Date() };
            await applicantUser.save();
            await Job.findByIdAndUpdate(application.job._id, { status: 'Filled' });
            application.status = 'Hired';
            await application.save();
            res.json({ message: 'Applicant hired successfully and moved to staff!' });

        } else if (action === 'reject') {
            application.status = 'Rejected';
            await application.save();
            res.json({ message: 'Applicant has been rejected.' });
        } else {
            res.status(400).json({ message: 'Invalid action specified.' });
        }
    } catch (error) {
        next(error);
    }
};