import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, 
    FaHome, FaInfoCircle, FaBed, FaConciergeBell, FaEnvelope, FaBriefcase,
    FaChalkboardTeacher // A great icon for the Staff Dashboard
} from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// This intelligent component ensures scroll/navigation links work perfectly on all pages.
const NavLinkWrapper = ({ to, icon, text, onClick }) => { const location = useLocation();
    const isHomePage = location.pathname === '/'; const linkContent = ( <div className="relative flex items-center gap-2 py-2"> {icon} <span>{text}</span> </div> ); 
    const linkClassName = "text-center md:text-base cursor-pointer text-text-light hover:text-brand-accent transition-colors"; if (isHomePage) { return <ScrollLink to={to} spy={true} smooth={true} offset={-70} duration={500} onClick={onClick} className={linkClassName}>{linkContent}</ScrollLink>; } 
    return <RouterLink to={`/#${to}`} onClick={onClick} className={linkClassName}>{linkContent}</RouterLink>; };
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // This array helps us cleanly distinguish staff from admins or guests.
    const staffRoles = ['Receptionist', 'Housekeeping', 'Laundry', 'Manager'];

    // ... (useEffect hooks for closing dropdown and preventing scroll remain the same) ...

    const navLinks = (
        <>
            <NavLinkWrapper to="hero" icon={<FaHome />} text="Home" onClick={() => setMobileMenuOpen(false)} />
            <NavLinkWrapper to="about" icon={<FaInfoCircle />} text="About" onClick={() => setMobileMenuOpen(false)} />
            <NavLinkWrapper to="rooms" icon={<FaBed />} text="Rooms" onClick={() => setMobileMenuOpen(false)} />
            <NavLinkWrapper to="amenities" icon={<FaConciergeBell />} text="Amenities" onClick={() => setMobileMenuOpen(false)} />
            <NavLinkWrapper to="contact" icon={<FaEnvelope />} text="Contact" onClick={() => setMobileMenuOpen(false)} />
            <RouterLink to="/careers" className="flex items-center gap-3 py-2 text-center text-xl md:text-base cursor-pointer text-text-light hover:text-brand-accent transition-colors" onClick={() => setMobileMenuOpen(false)}><FaBriefcase /><span>Careers</span></RouterLink>
        </>
    );

    return (
        <header className="bg-brand-primary/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 text-text-light">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <RouterLink to="/" className="transition-transform hover:scale-105">
                    <h1 className="text-2xl font-serif font-bold text-brand-accent">LuxuryStay</h1>
                </RouterLink>

                <nav className="hidden md:flex items-center space-x-8 font-medium">
                    {navLinks}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center relative" ref={dropdownRef}>
                        {user ? (
                           <>
                                <button onClick={() => setDropdownOpen(prev => !prev)} className="flex items-center gap-2 cursor-pointer">
                                    <FaUserCircle size={20} /> {user.name}
                                </button>
                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-text-dark py-1 z-40">
                                            {/* --- THE DEFINITIVE ROLE-BASED LOGIC --- */}
                                            {user.role === 'Admin' && (
                                                <NavLink to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                                                    <FaTachometerAlt /> Admin Panel
                                                </NavLink>
                                            )}
                                            {staffRoles.includes(user.role) && (
                                                <NavLink to="/staff/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                                                    <FaChalkboardTeacher /> Staff Dashboard
                                                </NavLink>
                                            )}
                                            <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100">
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                           </>
                        ) : (
                            <RouterLink to="/login" className="bg-brand-accent text-white font-bold py-2 px-5 rounded-md hover:bg-teal-500 transition-colors">Login</RouterLink>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu Overlay with new Role-Based Logic --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div /* ... */ className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" />
                        <motion.div /* ... */ className="fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-brand-primary p-6 md:hidden">
                            <nav className="mt-20 flex flex-col items-center space-y-6">
                               {navLinks}
                                <hr className="border-gray-700 my-4 w-full" />
                                {user ? ( 
                                    <div className="flex flex-col items-center space-y-6">
                                        <span className="flex items-center gap-2 pt-2 text-lg"><FaUserCircle /> {user.name}</span>
                                        {/* --- THE DEFINITIVE ROLE-BASED LOGIC (MOBILE) --- */}
                                        {user.role === 'Admin' && (
                                            <NavLink to="/admin" className="flex items-center justify-center gap-3 text-lg" onClick={() => setMobileMenuOpen(false)}><FaTachometerAlt /> Admin Panel</NavLink>
                                        )}
                                        {staffRoles.includes(user.role) && (
                                            <NavLink to="/staff/dashboard" className="flex items-center justify-center gap-3 text-lg" onClick={() => setMobileMenuOpen(false)}><FaChalkboardTeacher /> Staff Dashboard</NavLink>
                                        )}
                                        <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 text-lg"><FaSignOutAlt /> Logout</button>
                                    </div>
                                ) : ( 
                                    <RouterLink to="/login" className="bg-brand-accent text-white font-bold py-3 px-6 rounded-md text-center w-full" onClick={() => setMobileMenuOpen(false)}>Login</RouterLink> 
                                )}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};
export default Navbar;