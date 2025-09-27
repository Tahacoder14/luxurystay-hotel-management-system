const express = require('express');
const router = express.Router();

// --- THE FIX IS HERE ---
// Ensure ALL functions used below are correctly imported.
const { 
    createApplication, 
    getAllApplications, 
    processApplication 
} = require('../controllers/applicationController');

const { protect, admin } = require('../middleware/authMiddleware');
const cvUpload = require('../middleware/cvUploadMiddleware');

// Route for a user to submit a new application
// This uses the 'cvUpload' middleware to handle the file first.
router.post('/', cvUpload.single('cv'), createApplication);

// Route for an admin to get a list of all applications
router.get('/', protect, admin, getAllApplications);

// Route for an admin to process an application (hire/reject)
router.put('/:applicationId/process', protect, admin, processApplication);

module.exports = router;