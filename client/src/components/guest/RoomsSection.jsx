import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // <-- STEP 1: Import the useNavigate hook
import api from '../../api/api';
import { FaShoppingCart, FaWifi, FaUserFriends } from 'react-icons/fa';

// Define the base URL of your backend. This is essential for images to load correctly.
const BACKEND_URL = 'http://localhost:5001';

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
    }),
};

const RoomCard = ({ room, index }) => {
    const navigate = useNavigate(); // <-- STEP 2: Initialize the navigate function

    // Construct the full, absolute URL for the image
    const imageUrl = `${BACKEND_URL}${room.imageUrl.replace(/\\/g, '/')}`;

    // --- STEP 3: Create the handler function ---
    // This function will be called when the button is clicked.
    const handleNavigateToDetails = (roomId) => {
        navigate(`/rooms/${roomId}`);
    };

    return (
        <motion.div 
            className="group flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
        >
            <div className="overflow-hidden">
                <img src={imageUrl} alt={room.name} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="p-6 text-left flex flex-col flex-grow">
                <h3 className="text-2xl font-serif text-primary mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{room.description}</p>
                <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4 border-t pt-4">
                    <div className="flex items-center gap-2"><FaUserFriends /><span>2 Guests</span></div>
                    <div className="flex items-center gap-2"><FaWifi /><span>Free WiFi</span></div>
                </div>
                <div className="flex justify-between items-center mb-4">
                     <p className="text-text-dark">Starting from</p>
                     <p className="text-2xl font-bold text-secondary">${room.price}<span className="text-sm font-normal text-gray-500">/night</span></p>
                </div>
                {/* --- STEP 4: Use a standard <button> with the onClick handler and the icon --- */}
                <button 
                    onClick={() => handleNavigateToDetails(room._id)}
                    className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <FaShoppingCart />
                    Book Now
                </button>
            </div>
        </motion.div>
    );
};

const RoomsSection = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/rooms');
                setRooms(res.data);
            } catch (err) {
                setError('Could not load available rooms at this time.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, []);

    if (isLoading) return <div className="text-center py-20">Loading Accommodations...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <section id="rooms" className="py-20 bg-light-bg">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-serif font-bold text-primary mb-4">Our Accommodations</h2>
                <p className="text-text-dark max-w-2xl mx-auto mb-12">Choose from our exquisite selection of rooms and suites, each designed for your ultimate comfort.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {rooms.map((room, index) => (
                        <RoomCard key={room._id} room={room} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoomsSection;