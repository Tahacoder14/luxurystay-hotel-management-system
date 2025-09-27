import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { format } from 'date-fns';
import { FaRegCalendarCheck, FaRegCalendarTimes, FaPhone, FaEnvelope } from 'react-icons/fa';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ error: '', success: '' });

    const setTempFeedback = useCallback((message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 4000);
    }, []);

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            setTempFeedback('Failed to fetch bookings. Please try again later.', true);
        } finally {
            setIsLoading(false);
        }
    }, [setTempFeedback]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // --- THE CRITICAL FIX IS HERE: These functions were missing ---
    const handleCheckIn = async (bookingId) => {
        if (window.confirm('Are you sure you want to check this guest in?')) {
            try {
                await api.put(`/bookings/${bookingId}/checkin`);
                setTempFeedback('Guest checked in successfully!');
                fetchBookings(); // Re-fetch all bookings to get the latest statuses
            } catch (err) {
                setTempFeedback('Check-in failed.', true);
            }
        }
    };
    
    const handleCheckOut = async (bookingId) => {
        if (window.confirm('Are you sure you want to check this guest out?')) {
            try {
                await api.put(`/bookings/${bookingId}/checkout`);
                setTempFeedback('Guest checked out successfully!');
                fetchBookings(); // Re-fetch all bookings
            } catch (err) {
                setTempFeedback('Check-out failed.', true);
            }
        }
    };
    
    const statusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-100 text-blue-700';
            case 'Checked-In': return 'bg-green-100 text-green-700';
            case 'Checked-Out': return 'bg-gray-100 text-gray-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100';
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-text-muted">Loading Bookings...</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-primary mb-6">Booking Management</h1>

            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            {bookings.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">No bookings found.</div>
            ) : (
                <>
                    {/* --- Professional Mobile Card View --- */}
                    <div className="md:hidden space-y-4">
                        {bookings.map(b => (
                            <div key={b._id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-brand-primary">{b.room?.name || 'Deleted Room'}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor(b.status)}`}>{b.status}</span>
                                </div>
                                <div className="text-sm text-text-muted space-y-1 border-b pb-3">
                                    <p><strong>Guest:</strong> {b.guestDetails.firstName} {b.guestDetails.lastName}</p>
                                    <p className="flex items-center gap-2"><FaEnvelope /> {b.guestDetails.email}</p>
                                    <p className="flex items-center gap-2"><FaPhone /> {b.guestDetails.phone}</p>
                                    <p><strong>Dates:</strong> {format(new Date(b.checkInDate), 'MMM dd')} - {format(new Date(b.checkOutDate), 'MMM dd, yyyy')}</p>
                                    <p><strong>Total:</strong> ${b.totalPrice.toLocaleString()}</p>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    {b.status === 'Upcoming' && <button onClick={() => handleCheckIn(b._id)} className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded"><FaRegCalendarCheck /> Check In</button>}
                                    {b.status === 'Checked-In' && <button onClick={() => handleCheckOut(b._id)} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded"><FaRegCalendarTimes /> Check Out</button>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Professional Desktop Table View --- */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="border-b-2"><tr><th className="p-4">Room</th><th className="p-4">Guest Details</th><th className="p-4">Dates</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{b.room?.name || 'Deleted Room'}</td>
                                        <td className="p-4"><div className="font-medium">{b.guestDetails.firstName} {b.guestDetails.lastName}</div><div className="text-sm text-text-muted">{b.guestDetails.email}</div></td>
                                        <td className="p-4">{format(new Date(b.checkInDate), 'MMM dd')} - {format(new Date(b.checkOutDate), 'MMM dd, yyyy')}</td>
                                        <td className="p-4">${b.totalPrice.toLocaleString()}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>{b.status}</span></td>
                                        <td className="p-4">
                                            {b.status === 'Upcoming' && <button onClick={() => handleCheckIn(b._id)} className="bg-green-500 text-white text-sm py-1 px-3 rounded hover:bg-green-600">Check In</button>}
                                            {b.status === 'Checked-In' && <button onClick={() => handleCheckOut(b._id)} className="bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600">Check Out</button>}
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

export default BookingManagement;