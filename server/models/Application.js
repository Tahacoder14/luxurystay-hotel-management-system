import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: [true, 'Job ID is required for an application.'] 
    },
    name: { 
        type: String, 
        required: [true, 'Applicant name is required.'],
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Applicant email is required.'],
        trim: true
    },
    phone: { 
        type: String, 
        required: [true, 'Applicant phone number is required.'],
    },
    coverLetter: { 
        type: String,
        trim: true
    },
    // --- CV fields for serverless ---
    cv: { 
        type: Buffer // Store the CV file as a Buffer
    },
    cvType: {
        type: String // Store the MIME type (e.g., 'application/pdf')
    },
    // Keep cvPath for backward compatibility, but make it optional
    cvPath: { 
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Hired', 'Rejected'],
        default: 'Pending'
    },
}, {
    timestamps: true
});

export default mongoose.model('Application', ApplicationSchema);