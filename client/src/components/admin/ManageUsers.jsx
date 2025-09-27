import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';

const ManageUsers = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                setUsers(res.data);
            } catch (err) {
                setFeedback({ error: 'Failed to fetch users.', success: '' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const setTempFeedback = (message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 4000);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: parseInt(newRole) });
            setUsers(users.map(user => user._id === userId ? { ...user, role: parseInt(newRole) } : user));
            setTempFeedback('User role updated successfully!');
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Failed to update role.', true);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user?')) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(user => user._id !== userId));
                setTempFeedback('User deleted successfully!');
            } catch (err) {
                setTempFeedback(err.response?.data?.message || 'Failed to delete user.', true);
            }
        }
    };

    if (isLoading) return <div>Loading Users...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-primary mb-6">Manage Users</h1>
            
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map(user => (
                    <div key={user._id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-bold text-primary">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{user.role === 0 ? 'Admin' : 'User'}</div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <select value={user.role} disabled={currentUser?._id === user._id} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="text-sm p-2 border rounded-md disabled:opacity-50">
                                <option value={1}>Set as User</option><option value={0}>Set as Admin</option>
                            </select>
                            <button disabled={currentUser?._id === user._id} onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-700 p-2 disabled:text-gray-300">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                     <thead className="border-b-2"><tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="p-4"><div className="font-medium">{user.name}</div><div className="text-sm text-gray-500">{user.email}</div></td>
                                <td className="p-4">
                                    <select value={user.role} disabled={currentUser?._id === user._id} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="p-2 border rounded-md bg-gray-100 disabled:opacity-50">
                                        <option value={1}>User</option><option value={0}>Admin</option>
                                    </select>
                                </td>
                                <td className="p-4 text-center">
                                    <button disabled={currentUser?._id === user._id} onClick={() => handleDeleteUser(user._id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 disabled:text-gray-300 disabled:hover:bg-transparent">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ManageUsers;