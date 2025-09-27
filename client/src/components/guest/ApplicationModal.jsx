import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';

const ApplicationModal = ({ job, onClose }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', coverLetter: '' });
    const [cvFile, setCvFile] = useState(null);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(false);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = e => setCvFile(e.target.files[0]);

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        const applicationData = new FormData();
        applicationData.append('job', job._id);
        applicationData.append('cv', cvFile);
        Object.keys(formData).forEach(key => applicationData.append(key, formData[key]));

        try {
            const res = await api.post('/applications', applicationData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFeedback({ success: res.data.message, error: '' });
            setTimeout(onClose, 2000); // Close modal on success
        } catch (err) {
            setFeedback({ error: err.response?.data?.message || 'Application failed.', success: '' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-brand-primary mb-2">Apply for {job.title}</h2>
                        {feedback.success ? (
                             <p className="text-center text-green-500 bg-green-100 p-4 rounded-md">{feedback.success}</p>
                        ) : (
                            <form onSubmit={onSubmit} className="space-y-4">
                                <input type="text" name="name" placeholder="Full Name" onChange={onChange} required className="w-full p-2 border rounded"/>
                                <input type="email" name="email" placeholder="Email Address" onChange={onChange} required className="w-full p-2 border rounded"/>
                                <input type="tel" name="phone" placeholder="Phone Number" onChange={onChange} required className="w-full p-2 border rounded"/>
                                <textarea name="coverLetter" placeholder="Cover Letter (Optional)" onChange={onChange} rows="4" className="w-full p-2 border rounded"/>
                                <div>
                                    <label className="block text-sm font-medium">Upload CV (PDF, DOC, DOCX)</label>
                                    <input type="file" onChange={onFileChange} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-brand-subtle file:text-brand-primary"/>
                                </div>
                                {feedback.error && <p className="text-red-500 text-sm">{feedback.error}</p>}
                                <div className="flex justify-end gap-4 pt-2">
                                    <button type="button" onClick={onClose} className="py-2 px-4 rounded">Cancel</button>
                                    <button type="submit" disabled={isLoading} className="py-2 px-6 rounded bg-brand-primary text-white disabled:bg-gray-400">{isLoading ? 'Submitting...' : 'Submit Application'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
export default ApplicationModal;