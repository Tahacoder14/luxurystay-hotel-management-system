import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion} from 'framer-motion';
import api from '../../api/api';
import { format } from 'date-fns';
import { FaRegCalendarCheck, FaEnvelope, FaUser } from 'react-icons/fa';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [filter, setFilter] = useState('Upcoming');

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

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleCheckIn = async (bookingId) => {
        if (window.confirm('Are you sure you want to check this guest in?')) {
            try {
                await api.put(`/bookings/${bookingId}/checkin`);
                setTempFeedback('Guest checked in successfully!');
                fetchBookings();
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
                fetchBookings();
            } catch (err) {
                setTempFeedback('Check-out failed.', true);
            }
        }
    };

    const filteredBookings = useMemo(() => {
        if (filter === 'All') return bookings;
        return bookings.filter(b => b.status === filter);
    }, [bookings, filter]);
    
    const statusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-blue-100 text-blue-800';
            case 'Checked-In': return 'bg-green-100 text-green-800';
            case 'Checked-Out': return 'bg-gray-200 text-gray-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100';
        }
    };

    if (isLoading) return (
        <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <FaRegCalendarCheck className="mr-2 text-blue-600" /> Booking Management
            </h1>
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <div className="flex gap-2 mb-6 p-1 bg-gray-200 rounded-lg w-full sm:w-auto sm:max-w-md">
                {['Upcoming', 'Checked-In', 'All'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-2 px-4 text-sm rounded-md font-semibold transition-colors ${filter === f ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">No {filter.toLowerCase()} bookings found.</div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredBookings.map(b => (
                            <div key={b._id} className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
                                <div className="flex items-center mb-2">
                                    <FaUser className="text-gray-500 mr-2" />
                                    <h3 className="font-semibold text-gray-800">{b.guestDetails.firstName} {b.guestDetails.lastName}</h3>
                                </div>
                                <p className="text-gray-600 mb-2"><FaEnvelope className="inline mr-1" /> {b.guestDetails.email}</p>
                                <p className="text-gray-600 mb-2"><FaRegCalendarCheck className="inline mr-1" /> {format(new Date(b.checkInDate), 'MMM dd')} - {format(new Date(b.checkOutDate), 'MMM dd, yyyy')}</p>
                                <p className="text-gray-700 font-medium mb-2">${b.totalPrice.toLocaleString()}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor(b.status)}`}>{b.status}</span>
                                <div className="mt-3 flex space-x-2">
                                    {b.status === 'Upcoming' && <button onClick={() => handleCheckIn(b._id)} className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">Check In</button>}
                                    {b.status === 'Checked-In' && <button onClick={() => handleCheckOut(b._id)} className="bg-red-600 text-white text-sm py-1 px-3 rounded hover:bg-red-700">Check Out</button>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b-2">
                                <tr>
                                    <th className="p-4 text-gray-600 font-semibold">Room</th>
                                    <th className="p-4 text-gray-600 font-semibold">Guest</th>
                                    <th className="p-4 text-gray-600 font-semibold">Dates</th>
                                    <th className="p-4 text-gray-600 font-semibold">Price</th>
                                    <th className="p-4 text-gray-600 font-semibold">Status</th>
                                    <th className="p-4 text-gray-600 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => (
                                    <tr key={b._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">{b.room?.name || 'Deleted Room'}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{b.guestDetails.firstName} {b.guestDetails.lastName}</div>
                                            <div className="text-sm text-gray-500">{b.guestDetails.email}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{format(new Date(b.checkInDate), 'MMM dd')} - {format(new Date(b.checkOutDate), 'MMM dd, yyyy')}</td>
                                        <td className="p-4 font-semibold text-gray-800">${b.totalPrice.toLocaleString()}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor(b.status)}`}>{b.status}</span></td>
                                        <td className="p-4 text-center">
                                            {b.status === 'Upcoming' && <button onClick={() => handleCheckIn(b._id)} className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">Check In</button>}
                                            {b.status === 'Checked-In' && <button onClick={() => handleCheckOut(b._id)} className="bg-red-600 text-white text-sm py-1 px-3 rounded hover:bg-red-700">Check Out</button>}
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