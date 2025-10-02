import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FaDownload, FaCheck, FaTimes } from 'react-icons/fa';
import HireModal from './layout/HireModal'; // Import the new professional modal

const ViewApplications = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [hiringApplication, setHiringApplication] = useState(null); // State to control the hire modal

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    }, []);

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/applications');
            setApplications(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch applications.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    // This function is now called by the professional HireModal's 'onConfirm' prop
    const handleConfirmHire = async (staffTitle) => {
        if (!hiringApplication) return;
        try {
            const res = await api.put(`/applications/${hiringApplication._id}/process`, { action: 'hire', staffTitle });
            setTempFeedback(res.data.message);
            setHiringApplication(null); // Close the modal
            fetchApplications(); // Refresh the entire list to show updated statuses
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Action failed.', true);
            setHiringApplication(null); // Also close modal on failure
        }
    };

    const handleReject = async (appId) => {
        if (window.confirm('Are you sure you want to reject this applicant?')) {
            try {
                const res = await api.put(`/applications/${appId}/process`, { action: 'reject' });
                setTempFeedback(res.data.message);
                fetchApplications(); // Refresh the list
            } catch (err) {
                setTempFeedback(err.response?.data?.message || 'Action failed.', true);
            }
        }
    };
    
    // High-performance filtering for the tabs
    const filteredApplications = useMemo(() => {
        if (filter === 'All') return applications;
        return applications.filter(app => app.status === filter);
    }, [applications, filter]);
    
    // Helper for styling status badges
    const statusColor = (status) => {
         switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Hired': return 'bg-status-green-bg text-status-green-text';
            case 'Rejected': return 'bg-status-red-bg text-status-red-text';
            default: return 'bg-gray-100';
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* The Hire Modal is always rendered but its visibility is controlled by state */}
            <HireModal 
                application={hiringApplication} 
                isOpen={!!hiringApplication}
                onClose={() => setHiringApplication(null)}
                onConfirm={handleConfirmHire} 
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-text-dark">View Applications</h1>
                <div className="flex gap-1 mt-4 sm:mt-0 p-1 bg-gray-200 rounded-lg">
                    {['Pending', 'Hired', 'Rejected', 'All'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`py-1.5 px-4 text-sm rounded-md font-semibold transition-all ${filter === f ? 'bg-white shadow text-admin-primary' : 'text-text-muted hover:bg-gray-300/50'}`}>{f}</button>
                    ))}
                </div>
            </div>

            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}
            
            {isLoading ? <p className="text-center p-8 text-text-muted">Loading applications...</p> : (
                <>
                    {filteredApplications.length === 0 ? (
                        <div className="text-center p-8 bg-admin-card rounded-lg shadow">No {filter.toLowerCase()} applications found.</div>
                    ) : (
                        <>
                            {/* --- Professional & Responsive Mobile Card View --- */}
                            <div className="md:hidden space-y-4">
                                {filteredApplications.map(app => (
                                    <div key={app._id} className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-text-dark">{app.name}</h3><span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(app.status)}`}>{app.status}</span></div>
                                        <p className="text-sm text-text-muted">Applied for: <strong>{app.job?.title || 'N/A'}</strong></p>
                                        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                                            <a href={`${api.defaults.baseURL}/applications/${app._id}/cv`} className="flex-1 text-center bg-gray-100 py-2 rounded flex items-center justify-center gap-2"><FaDownload /> Download CV</a>
                                            {app.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => setHiringApplication(app)} className="flex-1 bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2"><FaCheck /> Hire</button>
                                                    <button onClick={() => handleReject(app._id)} className="flex-1 bg-red-500 text-white py-2 rounded flex items-center justify-center gap-2"><FaTimes /> Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
    
                            {/* --- Professional & Responsive Desktop Table View --- */}
                            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b-2"><tr><th className="p-4">Applicant</th><th className="p-4">Applied For</th><th className="p-4">Date</th><th className="p-4">CV</th><th className="p-4 text-center">Status / Actions</th></tr></thead>
                                    <tbody>
                                        {filteredApplications.map(app => (
                                            <tr key={app._id} className="border-b hover:bg-gray-50 last:border-b-0">
                                                <td className="p-4"><div className="font-medium text-text-dark">{app.name}</div><div className="text-sm text-text-muted">{app.email}</div></td>
                                                <td className="p-4 text-text-secondary">{app.job?.title || 'N/A'}</td>
                                                <td className="p-4 text-text-secondary">{format(new Date(app.createdAt), 'MMM dd, yyyy')}</td>
                                                <td className="p-4"><a href={`${api.defaults.baseURL}/applications/${app._id}/cv`} className="text-admin-primary hover:underline" title="Download CV"><FaDownload /></a></td>
                                                <td className="p-4 text-center">
                                                    {app.status === 'Pending' ? (
                                                        <div className="flex gap-2 justify-center">
                                                            <button onClick={() => setHiringApplication(app)} className="bg-green-500 text-white text-xs py-1 px-3 rounded hover:bg-green-600">Hire</button>
                                                            <button onClick={() => handleReject(app._id)} className="bg-red-500 text-white text-xs py-1 px-3 rounded hover:bg-red-600">Reject</button>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(app.status)}`}>{app.status}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </motion.div>
    );
};
export default ViewApplications;