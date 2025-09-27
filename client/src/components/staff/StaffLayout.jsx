import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FaSignOutAlt, FaGlobe } from 'react-icons/fa';

const StaffLayout = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-admin-bg">
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
                <div>
                    <h1 className="text-xl font-bold text-brand-primary">Staff Portal</h1>
                    <p className="text-sm text-text-muted hidden sm:block">Welcome, {user?.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-sm flex items-center gap-2 text-text-secondary hover:text-brand-accent transition-colors">
                        <FaGlobe /> <span className="hidden sm:inline">Visit Main Site</span>
                    </Link>
                    <button onClick={logout} className="text-sm flex items-center gap-2 text-text-secondary hover:text-red-500 transition-colors">
                        <FaSignOutAlt /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>
            <main className="p-4 md:p-8">
                {/* The StaffDashboard will be rendered here */}
                <Outlet /> 
            </main>
        </div>
    );
};
export default StaffLayout;