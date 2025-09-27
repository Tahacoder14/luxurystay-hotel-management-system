const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    // The title of the job position.
    title: { 
        type: String, 
        required: [true, 'Job title is required.'],
        trim: true 
    },
    // The location of the job.
    location: { 
        type: String, 
        required: [true, 'Job location is required.'],
        default: 'On-site'
    },
    // The type of employment.
    type: { 
        type: String, 
        required: [true, 'Employment type is required.'], 
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'] 
    },
    // A detailed description of the job responsibilities and requirements.
    description: { 
        type: String, 
        required: [true, 'Job description is required.'] 
    },
    // The current status of the job posting.
    status: {
        type: String,
        enum: ['Open', 'Filled', 'Closed'],
        default: 'Open'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);