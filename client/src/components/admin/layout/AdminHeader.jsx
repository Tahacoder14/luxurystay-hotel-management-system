import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaRegBell, FaSignOutAlt, FaGlobe, FaBars, FaUserCircle } from 'react-icons/fa';
import AuthContext from '../../../context/AuthContext';

const AdminHeader = ({ onMenuToggle }) => { // Receives the function to open the mobile menu
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Effect to close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-admin-card shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                 {/* This button is now fully functional */}
                 <button onClick={onMenuToggle} className="md:hidden text-text-secondary">
                    <FaBars size={20} />
                 </button>
                 <div className="relative hidden sm:block">
                    <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
                    <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 rounded-lg bg-admin-bg focus:outline-none focus:ring-2 focus:ring-admin-primary" />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-text-secondary hover:text-admin-primary">
                    <FaRegBell size={22} />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-status-red-text" />
                </button>
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(prev => !prev)} className="flex items-center gap-3">
                        {/* --- THE IMAGE REMOVAL FIX --- */}
                        {/* Replaced the placeholder image with a clean, professional icon */}
                        <FaUserCircle size={28} className="text-text-secondary" />
                        <div className="hidden md:block text-left">
                            <p className="font-semibold text-text-dark">{user ? user.name : 'Admin'}</p>
                            <p className="text-xs text-text-muted">{user?.role === 0 ? 'Senior Staff' : 'User'}</p>
                        </div>
                    </button>
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-text-dark py-1 z-50">
                                <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100">
                                    <FaGlobe /> Visit Site
                                </Link>
                                <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100">
                                    <FaSignOutAlt /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};
export default AdminHeader;