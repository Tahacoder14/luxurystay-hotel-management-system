import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Essential for date picker styling
import { differenceInCalendarDays, format } from 'date-fns';
import AuthContext from '../../context/AuthContext';
import { FaUserFriends, FaWifi, FaBed, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BACKEND_URL = 'http://localhost:5001';

const RoomDetailsPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false); // For button loading state
    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    });
    const [guestData, setGuestData] = useState({
        firstName: '', lastName: '', email: '', phone: '', specialRequests: ''
    });

    const [feedback, setFeedback] = useState({ error: '', success: '' });
    
    // Effect to pre-fill the form with logged-in user's details for convenience
    useEffect(() => {
        if (user) {
            setGuestData(prev => ({
                ...prev,
                firstName: user.name.split(' ')[0] || '',
                lastName: user.name.split(' ').slice(1).join(' ') || '',
                email: user.email,
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/rooms/${id}`);
                setRoom(res.data);
            } catch (err) {
                setFeedback({ error: 'Could not find room details.', success: '' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleGuestDataChange = (e) => setGuestData({ ...guestData, [e.target.name]: e.target.value });

    // --- THE DEFINITIVE BUG FIX for the non-clickable button ---
    const numberOfNights = useMemo(() => {
        if (!checkInDate || !checkOutDate) return 0;
        // The typo is corrected here to use checkInDate
        return differenceInCalendarDays(checkOutDate, checkInDate);
    }, [checkInDate, checkOutDate]);

    const totalPrice = useMemo(() => room ? numberOfNights * room.price : 0, [numberOfNights, room]);

    const handleBooking = async () => {
        if (numberOfNights <= 0) {
            setFeedback({ error: 'Check-out date must be after check-in date.', success: '' });
            return;
        }
        setIsBooking(true);
        
        const bookingData = { 
            room: room._id, checkInDate, checkOutDate, totalPrice, 
            guestDetails: guestData 
        };
        try {
            const res = await api.post('/bookings', bookingData);
            // On success, navigate to the professional confirmation page
            navigate(`/booking-confirmation/${res.data._id}`);
        } catch (err) {
            setFeedback({ error: err.response?.data?.message || 'Booking failed. Please check your details.', success: '' });
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return <div className="container mx-auto text-center py-20">Loading room details...</div>;
    if (!room) return <div className="container mx-auto text-center py-20 text-red-500">Room not found.</div>;

    const imageUrl = `${BACKEND_URL}${room.imageUrl.replace(/\\/g, '/')}`;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-12 md:py-20">
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6">{feedback.error}</p>}
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* --- Left Column (Room Details) - Perfectly Responsive --- */}
                <div className="lg:col-span-3">
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imageUrl} alt={room.name} className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-xl mb-6" />
                    <h1 className="text-4xl font-serif text-brand-primary">{room.name}</h1>
                    <p className="text-lg text-text-muted mt-4">{room.description}</p>
                     <div className="flex flex-wrap items-center text-gray-500 gap-x-6 gap-y-2 mt-6 border-t pt-6">
                        <div className="flex items-center gap-2"><FaUserFriends size={20} /><span>2 Guests</span></div>
                        <div className="flex items-center gap-2"><FaWifi size={20} /><span>Free WiFi</span></div>
                        <div className="flex items-center gap-2"><FaBed size={20} /><span>{room.type}</span></div>
                        <div className="flex items-center gap-2"><FaMoneyBillWave size={20} /><span>${room.price}/night</span></div>
                    </div>
                </div>

                {/* --- Right Column (Booking Form) - Professional UI/UX --- */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-xl sticky top-28">
                        <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">Your Reservation</h2>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-text-dark border-b pb-2">Guest Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-medium">First Name</label><input type="text" name="firstName" value={guestData.firstName} onChange={handleGuestDataChange} className="w-full p-2 border rounded mt-1" required/></div>
                                <div><label className="text-sm font-medium">Last Name</label><input type="text" name="lastName" value={guestData.lastName} onChange={handleGuestDataChange} className="w-full p-2 border rounded mt-1" required/></div>
                            </div>
                             <div><label className="text-sm font-medium">Email Address</label><input type="email" name="email" value={guestData.email} onChange={handleGuestDataChange} className="w-full p-2 border rounded mt-1" required/></div>
                            <div><label className="text-sm font-medium">Phone Number</label><input type="tel" name="phone" value={guestData.phone} onChange={handleGuestDataChange} className="w-full p-2 border rounded mt-1" required/></div>
                            
                            <h3 className="font-semibold text-text-dark border-b pb-2 pt-4">Select Dates</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div><label className="text-sm font-medium">Check-in</label><DatePicker selected={checkInDate} onChange={(date) => setCheckInDate(date)} minDate={new Date()} className="w-full p-2 border rounded-md mt-1"/></div>
                                <div><label className="text-sm font-medium">Check-out</label><DatePicker selected={checkOutDate} onChange={(date) => setCheckOutDate(date)} minDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)} className="w-full p-2 border rounded-md mt-1"/></div>
                            </div>

                            <div className="border-t pt-4 space-y-2 mt-4">
                                <div className="flex justify-between text-lg text-text-muted"><span>Price ({numberOfNights} nights)</span><span className="font-semibold">${totalPrice.toLocaleString()}</span></div>
                                <div className="flex justify-between text-xl font-bold text-brand-primary"><span>Total Price</span><span>${totalPrice.toLocaleString()}</span></div>
                            </div>

                            <button onClick={handleBooking} disabled={!user || totalPrice <= 0 || isBooking} className="w-full bg-brand-accent text-white font-bold py-3 rounded-md hover:bg-teal-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isBooking ? 'Processing...' : (user ? 'Confirm & Book Now' : 'Please Login to Book')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RoomDetailsPage;