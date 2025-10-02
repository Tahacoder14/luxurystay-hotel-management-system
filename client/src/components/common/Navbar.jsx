import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link as RouterLink, NavLink, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaChalkboardTeacher 
} from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';

// NavLinkWrapper component for smooth scroll/navigation
const NavLinkWrapper = ({ to, text, onClick }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const linkClassName = "text-gray-200 cursor-pointer hover:text-white transition-colors duration-300 font-medium";

    if (isHomePage) {
        return (
            <ScrollLink
                to={to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={onClick}
                className={linkClassName}
            >
                {text}
            </ScrollLink>
        );
    }
    return (
        <RouterLink
            to={`/#${to}`}
            onClick={onClick}
            className={linkClassName}
        >
            {text}
        </RouterLink>
    );
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const staffRoles = ['Receptionist', 'Housekeeping', 'Laundry', 'Manager'];
    const navItems = [
        { id: 'about', text: 'About' },
        { id: 'rooms', text: 'Rooms' },
        { id: 'amenities', text: 'Amenities' },
        { id: 'contact', text: 'Contact' },
    ];

    // Close dropdown when clicking outside
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-accent shadow-lg border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                {/* Logo */}
                <RouterLink to="/" className="flex items-center space-x-2">
                    <span className="text-3xl text-brand-primary">🏨</span>
                    <span className="text-2xl font-serif font-bold text-brand-primary dark:text-white">LuxuryStay</span>
                </RouterLink>

                {/* Mobile menu toggle */}
                <button
                    className="md:hidden text-brand-primary focus:outline-none"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Navigation */}
                <nav
                    className={`${
                        isMobileMenuOpen ? 'flex' : 'hidden'
                    } md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 absolute md:static top-full left-0 right-0 bg-brand-accent md:bg-transparent p-4 md:p-0 transition-all duration-300`}
                >
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8"
                    >
                        {navItems.map(item => (
                            <li key={item.id}>
                                <NavLinkWrapper
                                    to={item.id}
                                    text={item.text}
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                            </li>
                        ))}
                        <li>
                            <RouterLink
                                to="/careers"
                                className="text-gray-200 hover:text-white transition-colors duration-300 font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Careers
                            </RouterLink>
                        </li>
                        <li className="relative" ref={dropdownRef}>
                            {user ? (
                                <div>
                                    <button
                                        onClick={() => setDropdownOpen(prev => !prev)}
                                        className="flex items-center gap-2 text-gray-200 font-semibold hover:text-white transition-colors duration-300"
                                    >
                                        <FaUserCircle size={20} />
                                        {user.name}
                                        <svg
                                            className="w-2.5 h-2.5 ms-1"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg text-gray-800 py-2 z-40 dark:bg-gray-700"
                                            >
                                                {user.role === 'Admin' && (
                                                    <NavLink
                                                        to="/admin"
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <FaTachometerAlt />
                                                        Admin Panel
                                                    </NavLink>
                                                )}
                                                {staffRoles.includes(user.role) && (
                                                    <NavLink
                                                        to="/staff/dashboard"
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <FaChalkboardTeacher />
                                                        Staff Dashboard
                                                    </NavLink>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setDropdownOpen(false);
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                                                >
                                                    <FaSignOutAlt />
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <RouterLink to="/login">
                                    <button
                                        className="rounded-md border-2 border-white px-6 py-1 font-medium text-white hover:bg-white hover:text-brand-accent transition-colors duration-300"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </button>
                                </RouterLink>
                            )}
                        </li>
                    </motion.ul>
                </nav>
            </div>
        </nav>
    );
};

export default Navbar;