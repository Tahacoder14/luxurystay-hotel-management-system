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
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        // --- THE DEFINITIVE FIX ---
        // Find the user who submitted the application using their email from the application form.
        const applicantUser = await User.findOne({ email: application.email });
        if (!applicantUser && action === 'hire') {
            return res.status(404).json({ message: 'Cannot hire: The applicant does not have a user account.' });
        }

        if (action === 'hire') {
            // 1. Update the User's role and set their new staff title
            applicantUser.role = 'Receptionist'; // Default role, you could make this dynamic
            applicantUser.staffDetails = { title: staffTitle || application.job.title, hireDate: new Date() };
            await applicantUser.save();
            
            // 2. Update the Job posting status to 'Filled'
            await Job.findByIdAndUpdate(application.job._id, { status: 'Filled' });
            
            // 3. Update the Application status to 'Hired'
            application.status = 'Hired';
            await application.save();
            
            return res.json({ message: 'Applicant hired successfully! Their role has been updated.' });
        } 
        
        if (action === 'reject') {
            application.status = 'Rejected';
            await application.save();
            return res.json({ message: 'Applicant has been rejected.' });
        } 
        
        res.status(400).json({ message: 'Invalid action specified.' });
    } catch (error) {
        next(error);
    }
};