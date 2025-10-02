import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion'; // <-- THE CRITICAL FIX IS HERE
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';
import { FaTrash } from 'react-icons/fa';
// Assume you will create an EditGuestModal component similar to the EditRoomModal

const ManageGuests = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [guests, setGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ error: '', success: '' });

    // useCallback ensures functions are not recreated on every render
    const setTempFeedback = React.useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000);
    }, []);

    const fetchGuests = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/users/guests');
            setGuests(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch guest profiles.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => {
        fetchGuests();
    }, [fetchGuests]);

    const handleDeleteGuest = async (guestId) => {
        if (window.confirm('Are you sure you want to delete this guest profile?')) {
            try {
                await api.delete(`/users/${guestId}`);
                setGuests(guests.filter(g => g._id !== guestId));
                setTempFeedback('Guest profile deleted successfully.');
            } catch (err) {
                setTempFeedback('Failed to delete guest profile.', true);
            }
        }
    };

    // Check if the user has admin privileges (example logic)
    if (!currentUser || currentUser.role !== 'Admin') {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center text-red-500">
                You do not have permission to manage guest profiles. Please contact an admin.
            </motion.div>
        );
    }

    if (isLoading) return <div className="p-8 text-center">Loading Guest Profiles...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Guest Profiles</h1>

            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            {guests.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">No guest profiles found.</div>
            ) : (
                <>
                    {/* --- Mobile Card View --- */}
                    <div className="md:hidden space-y-4">
                        {guests.map(guest => (
                            <div key={guest._id} className="bg-white p-4 rounded-lg shadow">
                                <p className="font-bold text-brand-primary">{guest.name}</p>
                                <p className="text-sm text-text-muted">{guest.email}</p>
                                <div className="mt-4 pt-4 border-t flex justify-end">
                                    <button onClick={() => handleDeleteGuest(guest._id)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Desktop Table View --- */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2"><tr><th className="p-4">Guest</th><th className="p-4">Contact</th><th className="p-4 text-center">Actions</th></tr></thead>
                            <tbody>
                                {guests.map(guest => (
                                    <tr key={guest._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4"><div className="font-medium">{guest.name}</div></td>
                                        <td className="p-4"><div className="text-sm text-text-muted">{guest.email}</div></td>
                                        <td className="p-4 text-center">
                                            {/* In the future, an Edit button would go here */}
                                            {/* <button className="text-blue-500 hover:text-blue-700 p-2"><FaUserEdit /></button> */}
                                            <button onClick={() => handleDeleteGuest(guest._id)} className="text-red-500 hover:text-red-700 p-2"><FaTrash /></button>
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
export default ManageGuests;