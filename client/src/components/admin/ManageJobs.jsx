import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';

const ManageJobs = () => {
    // A clean initial state for resetting the form
    const initialState = { title: '', location: 'On-site', type: 'Full-time', description: '' };
    
    // State hooks for form data, feedback messages, and loading status
    const [formData, setFormData] = useState(initialState);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Standard handler for all form input changes
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // --- THE DEFINITIVE FIX IS HERE ---
    // This helper function was missing. It is now included and fully functional.
    const setTempFeedback = (message, isError = false) => {
        if (isError) {
            setFeedback({ error: message, success: '' });
        } else {
            setFeedback({ error: '', success: message });
        }
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    };

    // Professional submission handler with robust error handling and loading state
    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback({ error: '', success: '' });
        
        try {
            await api.post('/jobs', formData);
            setTempFeedback('Job posted successfully!');
            setFormData(initialState);
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Failed to post job. Please try again.', true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Manage Job Postings</h1>
            
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={onSubmit} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark">Job Title</label>
                            <input type="text" name="title" placeholder="e.g., Head Concierge" onChange={onChange} value={formData.title} required className="mt-1 w-full p-3 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-text-dark">Employment Type</label>
                            <select name="type" onChange={onChange} value={formData.type} className="mt-1 w-full p-3 border rounded-md">
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                            </select>
                         </div>
                     </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Location</label>
                        <input type="text" name="location" placeholder="e.g., On-site, Remote" onChange={onChange} value={formData.location} required className="mt-1 w-full p-3 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Job Description</label>
                        <textarea name="description" placeholder="Responsibilities, requirements, perks, etc." onChange={onChange} value={formData.description} rows="6" required className="mt-1 w-full p-3 border rounded-md"></textarea>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-brand-primary text-text-light font-bold py-3 rounded-md hover:bg-slate-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Posting...' : 'Post Job Opening'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ManageJobs;