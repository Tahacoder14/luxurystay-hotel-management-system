import express from 'express';
const router = express.Router();

// --- THE FIX IS HERE ---
// Ensure ALL functions used below are correctly imported.
import { 
    createApplication, 
    getAllApplications, 
    processApplication 
} from '../controllers/applicationController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import { downloadCV } from '../controllers/applicationController.js';
import cvUpload from '../middleware/cvUploadMiddleware.js';

// Route for a user to submit a new application
// This uses the 'cvUpload' middleware to handle the file first.
router.post('/', cvUpload.single('cv'), createApplication);

router.get('/:id/cv', protect, admin, downloadCV);

// Route for an admin to get a list of all applications
router.get('/', protect, admin, getAllApplications);

// Route for an admin to process an application (hire/reject)
router.put('/:applicationId/process', protect, admin, processApplication);

export default router;