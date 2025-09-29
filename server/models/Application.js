import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    // Link to the specific job being applied for. 'ref' is crucial for population.
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: [true, 'Job ID is required for an application.'] 
    },
    // The name of the applicant.
    name: { 
        type: String, 
        required: [true, 'Applicant name is required.'],
        trim: true
    },
    // The applicant's contact email.
    email: { 
        type: String, 
        required: [true, 'Applicant email is required.'],
        trim: true
    },
    // The applicant's contact phone number.
    phone: { 
        type: String, 
        required: [true, 'Applicant phone number is required.'],
    },
    // Optional cover letter text from the applicant.
    coverLetter: { 
        type: String,
        trim: true
    },
    // The server path to the applicant's uploaded CV file.
    cvPath: { 
        type: String, 
        required: [true, 'A path to the CV file is required.'] 
    },
    // The current status of the application, controlled by the admin.
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Hired', 'Rejected'], // Added 'Under Review' for more detail
        default: 'Pending'
    },
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

export default mongoose.model('Application', ApplicationSchema);