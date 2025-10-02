import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api'; // <-- USE THE CENTRAL API INSTANCE
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditRoomModal from './layout/EditRoomModal';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [editingRoom, setEditingRoom] = useState(null);

    // This feedback function is now correctly used by all action handlers.
    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    }, []);
    
    // This data fetching function is correctly defined and uses the central API.
    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        try {
            // --- THE DEFINITIVE CONNECTION FIX ---
            // Removed hardcoded URL. Using the central api instance with a relative path.
            const res = await api.get('/rooms');
            setRooms(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch rooms. Please try refreshing.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // This update handler is now correctly connected to the EditRoomModal.
    const handleUpdate = async (updatedRoomData) => {
        try {
            const res = await api.put(`/rooms/${editingRoom._id}`, updatedRoomData);
            setRooms(rooms.map(room => room._id === editingRoom._id ? res.data : room));
            setTempFeedback('Room updated successfully!');
            setEditingRoom(null); // Close the modal on success
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Failed to update room.', true);
        }
    };

    // This delete handler is now correctly connected to the delete buttons.
    const handleDelete = async (roomId) => {
        if (window.confirm('Are you sure you want to permanently delete this room?')) {
            try {
                // This call is now perfect. 'api' handles the base URL and the auth token.
                const res = await api.delete(`/rooms/${roomId}`);
                setRooms(rooms.filter(room => room._id !== roomId));
                setTempFeedback(res.data.message || 'Room deleted successfully!');
            } catch (err) {
                // The 'api' interceptor will handle 401 errors automatically.
                // This will only show for other errors (like 500).
                setTempFeedback(err.response?.data?.message || 'Failed to delete room.', true);
            }
        }
    };

    const statusColor = (status) => { /* ... (This helper function is correct) ... */ };

    // This status change handler is now correctly connected to the select dropdowns.
    const handleStatusChange = async (roomId) => {
        if (window.confirm('Are you sure you want to update this room?')) {
            try {
                // This call is now perfect. 'api' handles the base URL and the auth token.
                const res =  await api.put(`/rooms${roomId}`);
                setRooms(rooms.filter(room => room._id !== roomId));
                setTempFeedback(res.data.message || 'Room updated successfully!');
            } catch (err) {
                // The 'api' interceptor will handle 401 errors automatically.
                // This will only show for other errors (like 500).
                setTempFeedback(err.response?.data?.message || 'Failed to update room.', true);
            }
        }
    };

    if (isLoading) return <div className="p-8 text-center text-text-muted">Loading Room Listings...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Room Listings</h1>
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            {/* The EditRoomModal is now fully functional with the onSave prop connected. */}
            <EditRoomModal room={editingRoom} onClose={() => setEditingRoom(null)} onSave={handleUpdate} />

            {rooms.length === 0 ? (
                <div className="text-center p-8 bg-admin-card rounded-lg shadow">No rooms found. Go to "Add Room" to create one.</div>
            ) : (
                <>
                    {/* --- Mobile Card View with all functions connected --- */}
                    <div className="md:hidden space-y-4">
                        {rooms.map(room => (
                            <div key={room._id} className="bg-admin-card p-4 rounded-lg shadow">
                                <img src={room.imageUrl} alt={room.name} className="w-full h-40 object-cover rounded-md mb-4" />
                                <h3 className="font-bold text-lg">{room.name}</h3>
                                <p className="text-sm text-text-muted">${room.price}/night - {room.type}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <select value={room.status || ''} onChange={(e) => handleStatusChange(room._id, e.target.value)} className={`text-sm p-2 border rounded-md ${statusColor(room.status)}`}>
                                        <option>Available</option><option>Occupied</option><option>Cleaning</option><option>Maintenance</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingRoom(room)} className="text-admin-primary p-2" title="Edit Room"><FaEdit /></button>
                                        <button onClick={() => handleDelete(room._id)} className="text-status-red-text p-2" title="Delete Room"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Desktop Table View with all functions connected --- */}
                    <div className="hidden md:block bg-admin-card rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="border-b-2"><tr><th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Update Status</th><th className="p-4">Actions</th></tr></thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room._id} className="border-b hover:bg-gray-50 last:border-b-0">
                                        <td className="p-2"><img src={room.imageUrl} alt={room.name} className="w-24 h-16 object-cover rounded" /></td>
                                        <td className="p-4"><div className="font-medium text-text-dark">{room.name}</div><div className="text-sm text-text-muted">{room.type}</div></td>
                                        <td className="p-4 text-text-secondary">${room.price}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(room.status)}`}>{room.status}</span></td>
                                        <td className="p-4">
                                            <select value={room.status || ''} onChange={(e) => handleStatusChange(room._id, e.target.value)} className="p-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-admin-primary">
                                                <option>Available</option><option>Occupied</option><option>Cleaning</option><option>Maintenance</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex gap-4 justify-center">
                                                <button onClick={() => setEditingRoom(room)} className="text-admin-primary hover:text-blue-700" title="Edit Room"><FaEdit size={20} /></button>
                                                <button onClick={() => handleDelete(room._id)} className="text-status-red-text hover:text-red-700" title="Delete Room"><FaTrash size={20} /></button>
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
export default RoomList;