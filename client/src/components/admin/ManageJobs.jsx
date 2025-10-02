import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { FaPlus, FaTrash } from 'react-icons/fa';

const ManageJobs = () => {
    const initialState = { title: '', location: 'On-site', type: 'Full-time', description: '' };
    const [formData, setFormData] = useState(initialState);
    const [jobs, setJobs] = useState([]);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    }, []);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/jobs');
            setJobs(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch job postings.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post('/jobs', formData);
            setJobs([res.data, ...jobs]);
            setFormData(initialState);
            setTempFeedback('Job posted successfully!');
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Failed to post job.', true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to permanently delete this job posting? All associated applications will also be removed.')) {
            try {
                const res = await api.delete(`/jobs/${jobId}`);
                setJobs(jobs.filter(job => job._id !== jobId));
                setTempFeedback(res.data.message);
            } catch (err) {
                setTempFeedback(err.response?.data?.message || 'Failed to delete job.', true);
            }
        }
    };

    const statusColor = (status) => {
        return status === 'Open' ? 'bg-status-green-bg text-status-green-text' : 'bg-status-red-bg text-status-red-text';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Manage Job Postings</h1>
            
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Post a Job Form --- */}
                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-1 bg-admin-card p-6 rounded-lg shadow-lg h-fit">
                    <h2 className="text-xl font-bold text-text-dark mb-4">Post a New Job</h2>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark">Job Title</label>
                            <input type="text" name="title" placeholder="e.g., Head Concierge" onChange={onChange} value={formData.title} required className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-dark">Type</label>
                                <select name="type" onChange={onChange} value={formData.type} className="mt-1 w-full p-2 border rounded-md">
                                    <option>Full-time</option><option>Part-time</option><option>Contract</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-dark">Location</label>
                                <input type="text" name="location" onChange={onChange} value={formData.location} required className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark">Job Description</label>
                            <textarea name="description" placeholder="Responsibilities, requirements..." onChange={onChange} value={formData.description} rows="5" required className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-admin-primary text-white font-bold py-2 rounded-md transition-colors hover:bg-blue-700 disabled:bg-gray-400">
                            <FaPlus className="inline mr-2"/> {isSubmitting ? 'Posting...' : 'Post Opening'}
                        </button>
                    </form>
                </motion.div>

                {/* --- Right Column: Current Openings (with full functionality) --- */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-text-dark mb-4">Current Openings</h2>
                    {isLoading ? <p>Loading jobs...</p> : jobs.length === 0 ? (
                        <p className="p-4 bg-admin-card rounded-lg text-center text-text-muted">No open job positions.</p>
                    ) : (
                        <div className="space-y-4">
                            {jobs.map(job => (
                                <motion.div key={job._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-admin-card p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-text-dark">{job.title}</h3>
                                        <p className="text-sm text-text-muted">{job.location} &middot; {job.type}</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 sm:mt-0">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(job.status)}`}>{job.status}</span>
                                        <button onClick={() => handleDeleteJob(job._id)} className="text-status-red-text hover:text-red-700" title="Delete Job Posting">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
export default ManageJobs;