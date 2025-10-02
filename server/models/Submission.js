import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
        type: String,
        required: true,
        enum: ['Inquiry', 'Feedback']
    },
    status: {
        type: String,
        enum: ['New', 'Read', 'Archived'],
        default: 'New'
    }
}, { timestamps: true });

export default mongoose.model('Submission', SubmissionSchema);