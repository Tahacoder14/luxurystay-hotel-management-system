import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { format } from 'date-fns';
import { FaRegCalendarCheck, FaRegCalendarTimes, FaClipboardList } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

const StaffDashboard = () => {
    const { user } = useContext(AuthContext);
    const [updates, setUpdates] = useState([]);
    const [attendance, setAttendance] = useState(null);
    const [attendanceStatus, setAttendanceStatus] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ error: '', success: '' });

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 4000);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get('/staff/dashboard');
            setUpdates(res.data.updates);
            setAttendance(res.data.attendance);
            setAttendanceStatus(res.data.attendanceStatus);
        } catch (err) {
            setTempFeedback('Could not load dashboard data.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCheckIn = async () => {
        try {
            await api.post('/staff/attendance/checkin');
            setTempFeedback('Checked in successfully!', false);
            fetchData();
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Check-in failed.', true);
        }
    };

    const handleCheckOut = async () => {
        try {
            await api.put('/staff/attendance/checkout');
            setTempFeedback('Checked out successfully!', false);
            fetchData();
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Check-out failed.', true);
        }
    };

    if (isLoading) return <div className="text-center">Loading Dashboard...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Left Column: Attendance & Responsibilities --- */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-text-dark">Daily Attendance</h2>
                        <div className="text-center p-4 bg-gray-50 rounded-md">
                            <p className="text-text-muted">Your Status</p>
                            <p className={`font-bold text-lg ${attendanceStatus === 'Checked In' ? 'text-green-600' : 'text-red-600'}`}>{attendanceStatus}</p>
                            {attendanceStatus === 'Checked In' && attendance && <p className="text-xs text-gray-500">at {format(new Date(attendance.checkInTime), 'hh:mm a')}</p>}
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <button onClick={handleCheckIn} disabled={attendanceStatus === 'Checked In'} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"><FaRegCalendarCheck /> Check In</button>
                            <button onClick={handleCheckOut} disabled={attendanceStatus !== 'Checked In'} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"><FaRegCalendarTimes /> Check Out</button>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-text-dark flex items-center gap-2"><FaClipboardList /> My Responsibilities</h2>
                        <p className="text-text-secondary">Your primary role is <strong>{user?.role}</strong>.</p>
                        <p className="text-sm text-text-muted mt-2">Please check the daily updates for specific tasks and instructions from the management.</p>
                    </div>
                </div>

                {/* --- Right Column: Daily Updates --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-text-dark">Daily Updates from Admin</h2>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {updates.length > 0 ? updates.map(update => (
                                <div key={update._id} className="border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold text-brand-primary">{update.title}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{update.content}</p>
                                    <p className="text-xs text-text-muted mt-2">By {update.author.name} &middot; {format(new Date(update.createdAt), 'MMM dd, yyyy')}</p>
                                </div>
                            )) : <p className="text-text-muted text-center py-8">No updates today.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
export default StaffDashboard;