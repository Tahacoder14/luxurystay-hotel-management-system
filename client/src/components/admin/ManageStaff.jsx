import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';
import { FaUserShield, FaBusinessTime, FaBullhorn, FaPlus } from 'react-icons/fa';
import { format, formatDistanceToNowStrict } from 'date-fns';
import AddStaffModal from './layout/AddStaffModal';

// Reusable Tab Button component for clean code
const TabButton = ({ icon, text, activeTab, setActiveTab, tabName }) => (
    <button onClick={() => setActiveTab(tabName)} className={`flex items-center gap-2 py-3 px-4 text-sm md:text-base font-semibold border-b-2 transition-colors ${activeTab === tabName ? 'border-admin-primary text-admin-primary' : 'border-transparent text-text-muted hover:text-text-dark'}`}>
        {icon}
        <span className="hidden md:inline">{text}</span>
    </button>
);

const ManageStaff = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('profiles');
    
    // States for each data type
    const [staffList, setStaffList] = useState([]);
    const [attendanceLog, setAttendanceLog] = useState([]);
    
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // State for the "Post Update" form
    const [newUpdate, setNewUpdate] = useState({ title: '', content: '' });

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [staffRes, attendanceRes] = await Promise.all([
                api.get('/users/staff'),
                api.get('/attendance')
            ]);
            setStaffList(staffRes.data);
            setAttendanceLog(attendanceRes.data);
        } catch (err) {
            setTempFeedback('Failed to fetch initial staff data.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleStaffAdded = (newStaff) => {
        setStaffList([newStaff, ...staffList]);
        setTempFeedback('Staff member added successfully!');
    };
    
    const handleStatusChange = async (staffId, newStatus) => { /* ... */ };
    const handleRoleChange = async (staffId, newRole) => { /* ... */ };
    
    const handlePostUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/updates', newUpdate);
            setNewUpdate({ title: '', content: '' });
            setTempFeedback('Update posted successfully!');
        } catch (err) {
            setTempFeedback('Failed to post update.', true);
        }
    };
    
    const getWorkHours = (checkIn, checkOut) => {
        if (!checkOut) return 'N/A';
        return formatDistanceToNowStrict(new Date(checkIn), { unit: 'hour' }) + ' hrs';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AddStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onStaffAdded={handleStaffAdded} />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-3xl font-bold text-text-dark">Staff Operations Center</h1>
                <button onClick={() => setIsAddModalOpen(true)} className="mt-4 sm:mt-0 flex items-center gap-2 bg-admin-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    <FaPlus /> Add New Staff
                </button>
            </div>
            
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <div className="flex border-b border-gray-200 mb-6">
                <TabButton icon={<FaUserShield/>} text="Staff Profiles" activeTab={activeTab} setActiveTab={setActiveTab} tabName="profiles" />
                <TabButton icon={<FaBusinessTime/>} text="Attendance Log" activeTab={activeTab} setActiveTab={setActiveTab} tabName="attendance" />
                <TabButton icon={<FaBullhorn/>} text="Post an Update" activeTab={activeTab} setActiveTab={setActiveTab} tabName="updates" />
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {isLoading ? <div className="text-center p-8">Loading...</div> : <>
                        {activeTab === 'profiles' && (
                            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b-2"><tr><th className="p-4">Staff Member</th><th className="p-4">Title</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                                    <tbody>
                                        {staffList.map(s => (
                                            <tr key={s._id} className="border-b hover:bg-gray-50">
                                                <td className="p-4"><div className="font-medium">{s.name}</div><div className="text-sm text-text-muted">{s.email}</div></td>
                                                <td className="p-4">{s.staffDetails?.title || 'Staff'}</td>
                                                <td className="p-4">
                                                    <select value={s.role} disabled={currentUser?._id === s._id} onChange={(e) => handleRoleChange(s._id, e.target.value)} className="p-2 border rounded-md bg-gray-50">
                                                        <option>Receptionist</option><option>Housekeeping</option><option>Laundry</option><option>Manager</option><option>Admin</option>
                                                    </select>
                                                </td>
                                                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.isActive ? 'bg-status-green-bg text-status-green-text' : 'bg-status-red-bg text-status-red-text'}`}>{s.isActive ? 'Active' : 'Inactive'}</span></td>
                                                <td className="p-4"><button onClick={() => handleStatusChange(s._id, !s.isActive)} disabled={currentUser?._id === s._id} className="text-sm py-1 px-3 rounded text-white disabled:bg-gray-300 bg-orange-500 hover:bg-orange-600">{s.isActive ? 'Deactivate' : 'Activate'}</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'attendance' && (
                            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                                <table className="w-full text-left">
                                     <thead className="border-b-2"><tr><th className="p-4">Staff Member</th><th className="p-4">Date</th><th className="p-4">Check In</th><th className="p-4">Check Out</th><th className="p-4">Hours</th></tr></thead>
                                     <tbody>
                                         {attendanceLog.map(log => (
                                             <tr key={log._id} className="border-b hover:bg-gray-50">
                                                 <td className="p-4 font-medium">{log.staffMember.name}</td>
                                                 <td className="p-4">{format(new Date(log.checkInTime), 'MMM dd, yyyy')}</td>
                                                 <td className="p-4 text-green-600">{format(new Date(log.checkInTime), 'hh:mm a')}</td>
                                                 <td className="p-4 text-red-600">{log.checkOutTime ? format(new Date(log.checkOutTime), 'hh:mm a') : 'N/A'}</td>
                                                 <td className="p-4 font-semibold">{getWorkHours(log.checkInTime, log.checkOutTime)}</td>
                                             </tr>
                                         ))}
                                     </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'updates' && (
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
                                <form onSubmit={handlePostUpdate} className="space-y-4">
                                    <input type="text" placeholder="Update Title" value={newUpdate.title} onChange={e => setNewUpdate({...newUpdate, title: e.target.value})} required className="w-full p-3 border rounded-md" />
                                    <textarea placeholder="Update Content" value={newUpdate.content} onChange={e => setNewUpdate({...newUpdate, content: e.target.value})} rows="5" required className="w-full p-3 border rounded-md" />
                                    <button type="submit" className="w-full bg-admin-primary text-white font-bold py-3 rounded-md">Post Update</button>
                                </form>
                            </div>
                        )}
                    </>}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};
export default ManageStaff;