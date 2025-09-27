import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const ViewApplications = () => {
    const [applications, setApplications] = useState([]);
    // ... isLoading, feedback states

    const fetchApplications = useCallback(async () => {
        // ... fetch logic using api.get('/applications')
    }, []);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const handleProcessApplication = async (appId, action) => {
        let staffTitle = '';
        if (action === 'hire') {
            staffTitle = prompt("Please enter the job title for this new staff member:", "Staff");
            if (!staffTitle) return; // User cancelled the prompt
        }
        try {
            await api.put(`/applications/${appId}/process`, { action, staffTitle });
            fetchApplications(); // Refresh the list to show the updated status
        } catch (err) {
            // ... set error feedback
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Job Applications</h1>
            {/* ... Feedback and Loading UI ... */}
            {/* --- RESPONSIVE Cards (mobile) / Table (desktop) for applications --- */}
            {applications.map(app => (
                <div key={app._id} className="bg-white p-4 rounded-lg shadow mb-4">
                    {/* ... Applicant details ... */}
                    <div className="mt-4 pt-4 border-t flex gap-2">
                        {app.status === 'Pending' && (
                            <>
                                <button onClick={() => handleProcessApplication(app._id, 'hire')} className="flex-1 bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2"><FaCheck /> Hire</button>
                                <button onClick={() => handleProcessApplication(app._id, 'reject')} className="flex-1 bg-red-500 text-white py-2 rounded flex items-center justify-center gap-2"><FaTimes /> Reject</button>
                            </>
                        )}
                        {app.status !== 'Pending' && <p className="font-bold">{app.status}</p>}
                    </div>
                </div>
            ))}
        </motion.div>
    );
};
export default ViewApplications;