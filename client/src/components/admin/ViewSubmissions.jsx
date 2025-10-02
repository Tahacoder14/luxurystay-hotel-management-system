// --- THE DEFINITIVE FIX IS HERE ---
// All the necessary React Hooks are now correctly imported.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api/api';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaTrash, FaArchive, FaEye, FaQuestionCircle, FaCommentDots } from 'react-icons/fa';

const ViewSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('New');
    const [feedback, setFeedback] = useState({ error: '', success: '' });

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    }, []);

    const fetchSubmissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/submissions');
            setSubmissions(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch submissions.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/submissions/${id}/status`, { status });
            setSubmissions(submissions.map(s => s._id === id ? { ...s, status } : s));
            setTempFeedback(`Message marked as ${status}.`);
        } catch (err) {
            setTempFeedback('Failed to update status.', true);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this message?')) {
            try {
                await api.delete(`/submissions/${id}`);
                setSubmissions(submissions.filter(s => s._id !== id));
                setTempFeedback('Submission deleted successfully.');
            } catch (err) {
                setTempFeedback('Failed to delete message.', true);
            }
        }
    };

    const filteredSubmissions = useMemo(() => {
        if (filter === 'All') return submissions;
        return submissions.filter(s => s.status === filter);
    }, [submissions, filter]);

    const statusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Read': return 'bg-gray-200 text-gray-800';
            case 'Archived': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100';
        }
    };

    if (isLoading) return <div className="p-8 text-center text-text-muted">Loading Submissions...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-text-dark">Guest Submissions</h1>
                <div className="flex gap-1 mt-4 sm:mt-0 p-1 bg-gray-200 rounded-lg">
                    {['New', 'Read', 'Archived', 'All'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`py-1.5 px-4 text-sm rounded-md font-semibold transition-all ${filter === f ? 'bg-white shadow text-admin-primary' : 'text-text-muted hover:bg-gray-300/50'}`}>{f}</button>
                    ))}
                </div>
            </div>

            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            {filteredSubmissions.length === 0 ? (
                <div className="text-center p-8 bg-admin-card rounded-lg shadow">No {filter.toLowerCase()} submissions found.</div>
            ) : (
                <>
                    {/* --- Professional & Responsive Mobile Card View --- */}
                    <div className="md:hidden space-y-4">
                        {filteredSubmissions.map(sub => (
                            <div key={sub._id} className="bg-admin-card p-4 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-text-dark flex items-center gap-2">{sub.type === 'Inquiry' ? <FaQuestionCircle className="text-blue-500" /> : <FaCommentDots className="text-purple-500" />} {sub.name}</div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(sub.status)}`}>{sub.status}</span>
                                </div>
                                <p className="text-sm text-text-muted border-b pb-3 mb-3">{sub.email}</p>
                                <p className="text-text-secondary text-sm mb-4">{sub.message}</p>
                                <div className="flex justify-end gap-2">
                                    {sub.status === 'New' && <button onClick={() => handleStatusUpdate(sub._id, 'Read')} className="p-2 text-text-muted hover:text-admin-primary" title="Mark as Read"><FaEye /></button>}
                                    {sub.status === 'Read' && <button onClick={() => handleStatusUpdate(sub._id, 'Archived')} className="p-2 text-text-muted hover:text-yellow-500" title="Archive"><FaArchive /></button>}
                                    <button onClick={() => handleDelete(sub._id)} className="p-2 text-text-muted hover:text-status-red-text" title="Delete"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Professional & Responsive Desktop Table View --- */}
                    <div className="hidden md:block bg-admin-card rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2"><tr><th className="p-4">Type</th><th className="p-4">From</th><th className="p-4 w-1/2">Message</th><th className="p-4">Received</th><th className="p-4">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                            <tbody>
                                {filteredSubmissions.map(sub => (
                                    <tr key={sub._id} className="border-b hover:bg-gray-50 last:border-b-0">
                                        <td className="p-4"><span className={`inline-flex items-center gap-2 font-semibold ${sub.type === 'Inquiry' ? 'text-blue-500' : 'text-purple-500'}`}>{sub.type === 'Inquiry' ? <FaQuestionCircle /> : <FaCommentDots />} {sub.type}</span></td>
                                        <td className="p-4"><div className="font-medium text-text-dark">{sub.name}</div><div className="text-sm text-text-muted">{sub.email}</div></td>
                                        <td className="p-4 text-text-secondary text-sm">{sub.message}</td>
                                        <td className="p-4 text-sm text-text-muted">{format(new Date(sub.createdAt), 'MMM dd, yyyy')}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(sub.status)}`}>{sub.status}</span></td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-center">
                                                {sub.status === 'New' && <button onClick={() => handleStatusUpdate(sub._id, 'Read')} className="p-2 text-text-muted hover:text-admin-primary" title="Mark as Read"><FaEye /></button>}
                                                {sub.status === 'Read' && <button onClick={() => handleStatusUpdate(sub._id, 'Archived')} className="p-2 text-text-muted hover:text-yellow-500" title="Archive"><FaArchive /></button>}
                                                <button onClick={() => handleDelete(sub._id)} className="p-2 text-text-muted hover:text-status-red-text" title="Delete"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </motion.div>
    );
};
export default ViewSubmissions;