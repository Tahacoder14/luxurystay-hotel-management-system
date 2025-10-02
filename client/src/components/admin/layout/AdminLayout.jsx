import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaHome, FaUserFriends, FaCalendarAlt,FaBriefcase, FaFileAlt, 
    FaPlus, FaList, FaUserShield, FaChevronLeft 
} from 'react-icons/fa';
import AdminHeader from './AdminHeader';

// --- A DEDICATED, REUSABLE COMPONENT FOR NAVIGATION LINKS ---
const AdminNavLink = ({ to, icon, children, isExpanded, ...props }) => {
    const activeLinkStyle = { backgroundColor: '#4A69FF', color: '#FFFFFF' };
    return (
        <NavLink to={to} end={to === "/admin"} style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="flex items-center gap-4 p-3 rounded-lg text-text-secondary hover:bg-admin-primary hover:text-white transition-colors group" {...props}>
            {icon}
            <AnimatePresence>{isExpanded && <motion.span initial={{ opacity: 0}} animate={{ opacity: 1, x: 0 }} className="whitespace-nowrap">{children}</motion.span>}</AnimatePresence>
        </NavLink>
    );
};

// --- THE SIDEBAR CONTENT IS NOW ITS OWN COMPONENT FOR CLEANLINESS & REUSABILITY ---
const SidebarContent = ({ isExpanded }) => (
  <nav className="flex flex-col space-y-1 mt-4 px-2">
      <div className="pt-4 pb-1 px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{isExpanded && "Main"}</div>
      <AdminNavLink to="/admin" icon={<FaHome size={20} />} isExpanded={isExpanded}>Home</AdminNavLink>
      <AdminNavLink to="/admin/manage-bookings" icon={<FaCalendarAlt size={20} />} isExpanded={isExpanded}>Reservations</AdminNavLink>
      
      <div className="pt-4 pb-1 px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{isExpanded && "Rooms"}</div>
      <AdminNavLink to="/admin/manage-rooms" icon={<FaPlus size={20} />} isExpanded={isExpanded}>Add Room</AdminNavLink>
      <AdminNavLink to="/admin/room-list" icon={<FaList size={20} />} isExpanded={isExpanded}>Room List</AdminNavLink>
      
      <div className="pt-4 pb-1 px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{isExpanded && "People"}</div>
      <AdminNavLink to="/admin/manage-staff" icon={<FaUserShield size={20} />} isExpanded={isExpanded}>Staff</AdminNavLink>
      <AdminNavLink to="/admin/manage-guests" icon={<FaUserFriends size={20} />} isExpanded={isExpanded}>Guests</AdminNavLink>
      
      <div className="pt-4 pb-1 px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">{isExpanded && "Recruitment"}</div>
      <AdminNavLink to="/admin/manage-jobs" icon={<FaBriefcase size={20} />} isExpanded={isExpanded}>Post Job</AdminNavLink>
      <AdminNavLink to="/admin/view-applications" icon={<FaFileAlt size={20} />} isExpanded={isExpanded}>Applications</AdminNavLink>
  </nav>
);

const AdminLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-admin-bg">
             {/* --- Desktop Sidebar (Collapsible) --- */}
             <motion.aside animate={{ width: isSidebarOpen ? '16rem' : '5rem' }} className="bg-admin-card flex-col hidden md:flex relative shadow-lg">
                <div className="font-sans font-bold text-admin-primary text-2xl p-4 overflow-hidden whitespace-nowrap flex items-center gap-2 h-16 border-b">
                    <span className="text-3xl text-admin-primary flex-shrink-0">🏨</span>
                    {isSidebarOpen && "HOTEL"}
                </div>
                {/* --- RENDER THE SIDEBAR CONTENT COMPONENT --- */}
                <SidebarContent isExpanded={isSidebarOpen} />
                <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-16 bg-admin-primary text-white p-1 rounded-full z-10 transition-transform hover:scale-110">
                    <FaChevronLeft className={`transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
                </button>
             </motion.aside>

            {/* --- Mobile Sidebar (Overlay) --- */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', ease: 'easeInOut' }} className="absolute inset-y-0 left-0 z-30 w-64 bg-admin-card flex-col flex shadow-xl">
                            <div className="font-sans font-bold text-admin-primary text-2xl p-4 overflow-hidden whitespace-nowrap flex items-center gap-2 h-16 border-b">
                                <span className="text-3xl">🏨</span> HOTEL
                            </div>
                            {/* --- RENDER THE SIDEBAR CONTENT COMPONENT --- */}
                            <SidebarContent isExpanded={true} />
                        </motion.aside>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-20 md:hidden" />
                    </>
                )}
            </AnimatePresence>
            
            <div className="flex-1 flex flex-col w-full overflow-x-hidden">
                <AdminHeader onMenuToggle={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default AdminLayout;