import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { FaShoppingCart, FaWifi, FaUserFriends, FaBed } from 'react-icons/fa';

// --- The Professional, Reusable, and Data-Driven Room Card ---
const RoomCard = ({ room, index }) => {
    const navigate = useNavigate();

    // The imageUrl from your database is a Data URI and can be used directly.
    const imageUrl = room.imageUrl;

    const handleNavigateToDetails = (roomId) => {
        navigate(`/rooms/${roomId}`);
    };

    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { delay: index * 0.1, duration: 0.5 }}
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group flex flex-col bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl"
        >
            <div className="overflow-hidden relative">
                <img 
                    src={imageUrl} 
                    alt={room.name} 
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute top-0 right-0 bg-brand-accent text-white px-3 py-1 text-sm font-bold rounded-bl-lg">{room.type}</div>
            </div>
            <div className="p-6 text-left flex flex-col flex-grow">
                <h3 className="text-2xl font-serif text-brand-primary mb-2">{room.name}</h3>
                <p className="text-text-muted text-sm mb-4 flex-grow">{room.description}</p>
                
                <div className="flex items-center text-text-muted text-sm space-x-4 mb-4 border-t pt-4">
                    <div className="flex items-center gap-2" title="Max Guests"><FaUserFriends /><span>2 Guests</span></div>
                    <div className="flex items-center gap-2" title="Free WiFi"><FaWifi /><span>Free WiFi</span></div>
                    <div className="flex items-center gap-2" title="Room Type"><FaBed /><span>{room.type}</span></div>
                </div>

                <div className="flex justify-between items-center mb-4">
                     <p className="text-text-dark">Starting from</p>
                     <p className="text-2xl font-bold text-brand-accent">${room.price}<span className="text-sm font-normal text-text-muted">/night</span></p>
                </div>
                <button 
                    onClick={() => handleNavigateToDetails(room._id)}
                    className="w-full bg-brand-primary text-white font-bold py-3 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                    <FaShoppingCart />
                    Book Now
                </button>
            </div>
        </motion.div>
    );
};

const RoomsSection = () => {
    const [allRooms, setAllRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ type: 'All', maxPrice: '1000' });

    const fetchRooms = useCallback(async () => {
        try {
            const res = await api.get('/rooms');
            setAllRooms(res.data);
        } catch (err) {
            setError('Could not load available rooms at this time. Please try again later.');
            console.error(err); // Log the full error for debugging
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // High-performance filtering logic using useMemo
    const filteredRooms = useMemo(() => {
        return allRooms.filter(room => {
            const typeMatch = filters.type === 'All' || room.type === filters.type;
            const priceMatch = room.price <= parseInt(filters.maxPrice);
            return typeMatch && priceMatch;
        });
    }, [allRooms, filters]);

    // Handler function that is now correctly connected to the filter inputs
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (isLoading) return <div className="text-center py-20 text-text-muted">Loading Accommodations...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <section id="rooms" className="py-20 bg-brand-light">
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Our Accommodations</h2>
                <p className="text-text-muted max-w-2xl mx-auto mb-12">Find the perfect space for your stay by filtering our exquisite selection of rooms and suites.</p>
                
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
                    className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto"
                >
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="typeFilter" className="block text-sm font-medium text-left text-text-dark">Room Type</label>
                        <select 
                            id="typeFilter"
                            name="type" 
                            value={filters.type} 
                            onChange={handleFilterChange} 
                            className="w-full p-2 border rounded-md mt-1 focus:ring-2 focus:ring-brand-accent"
                        >
                            <option value="All">All Types</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Suite">Suite</option>
                            <option value="Double">Double</option>
                            <option value="Single">Single</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-1/2">
                        <label htmlFor="priceFilter" className="block text-sm font-medium text-left text-text-dark">Max Price: <span className="font-bold text-brand-accent">${filters.maxPrice}</span></label>
                        <input 
                            id="priceFilter"
                            type="range" 
                            name="maxPrice" 
                            min="100" 
                            max="1000" 
                            step="50" 
                            value={filters.maxPrice} 
                            onChange={handleFilterChange} 
                            className="w-full mt-2 h-2 bg-brand-subtle rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredRooms.length > 0 ? (
                        filteredRooms.map((room, index) => <RoomCard key={room._id} room={room} index={index} />)
                    ) : (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-10">
                            <p className="text-lg text-text-muted">No rooms match your current filters. Please try adjusting your selection.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default RoomsSection;