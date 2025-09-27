import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditRoomModal from './layout/EditRoomModal';

// Define the base URL of your backend. This is a crucial best practice.
const BACKEND_URL = 'http://localhost:5001';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [editingRoom, setEditingRoom] = useState(null);

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 4000);
    }, []);

    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch rooms.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const handleUpdate = async (updatedRoomData) => {
        try {
            const res = await api.put(`/rooms/${editingRoom._id}`, updatedRoomData);
            setRooms(rooms.map(room => room._id === editingRoom._id ? res.data : room));
            setTempFeedback('Room updated successfully!');
            setEditingRoom(null);
        } catch (err) {
            setTempFeedback('Failed to update room.', true);
        }
    };

    const handleDelete = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
            try {
                await api.delete(`/rooms/${roomId}`);
                setRooms(rooms.filter(room => room._id !== roomId));
                setTempFeedback('Room deleted successfully!');
            } catch (err) {
                setTempFeedback('Failed to delete room.', true);
            }
        }
    };
    
    const statusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-700';
            case 'Occupied': return 'bg-red-100 text-red-700';
            case 'Cleaning': return 'bg-yellow-100 text-yellow-700';
            case 'Maintenance': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100';
        }
    };

    const handleStatusChange = async (roomId, newStatus) => {
        try {
            await api.put(`/rooms/${roomId}`, { status: newStatus });
            setRooms(rooms.map(room => room._id === roomId ? { ...room, status: newStatus } : room));
            setTempFeedback('Room status updated!');
        } catch (err) {
            setTempFeedback('Failed to update status.', true);
        }
    };
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-primary mb-6">Room Listings</h1>
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <EditRoomModal room={editingRoom} onClose={() => setEditingRoom(null)} onSave={handleUpdate} />

            {isLoading ? (
                <div className="p-8 text-center">Loading Room Listings...</div>
            ) : rooms.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">No rooms found. Please add a new room to see it listed here.</div>
            ) : (
                <>
                    {/* --- Mobile Card View (md:hidden) --- */}
                    <div className="md:hidden space-y-4">
                        {rooms.map(room => (
                            <div key={room._id} className="bg-white p-4 rounded-lg shadow">
                                <img src={`${BACKEND_URL}${room.imageUrl}`} alt={room.name} className="w-full h-40 object-cover rounded-md mb-4" />
                                <h3 className="font-bold text-lg">{room.name}</h3>
                                <p className="text-sm text-gray-500">${room.price}/night - {room.type}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <select value={room.status} onChange={(e) => handleStatusChange(room._id, e.target.value)} className={`text-sm p-2 border rounded-md ${statusColor(room.status)}`}>
                                        <option>Available</option><option>Occupied</option><option>Cleaning</option><option>Maintenance</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingRoom(room)} className="text-blue-500 p-2"><FaEdit /></button>
                                        <button onClick={() => handleDelete(room._id)} className="text-red-500 p-2"><FaTrash /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Desktop Table View (hidden md:block) --- */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2"><tr><th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Update Status</th><th className="p-4">Actions</th></tr></thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2"><img src={`${BACKEND_URL}${room.imageUrl}`} alt={room.name} className="w-24 h-16 object-cover rounded" /></td>
                                        <td className="p-4"><div className="font-medium">{room.name}</div><div className="text-sm text-gray-500">{room.type}</div></td>
                                        <td className="p-4">${room.price}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(room.status)}`}>{room.status}</span></td>
                                        <td className="p-4">
                                            <select value={room.status} onChange={(e) => handleStatusChange(room._id, e.target.value)} className="p-2 border rounded-md bg-gray-50">
                                                <option>Available</option><option>Occupied</option><option>Cleaning</option><option>Maintenance</option>
                                            </select>
                                        </td>
                                        <td className="p-4 flex gap-4 items-center h-full mt-6">
                                            <button onClick={() => setEditingRoom(room)} className="text-blue-500 hover:text-blue-700"><FaEdit size={20} /></button>
                                            <button onClick={() => handleDelete(room._id)} className="text-red-500 hover:text-red-700"><FaTrash size={20} /></button>
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