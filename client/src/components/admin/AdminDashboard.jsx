import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Use Link for the new widget
import { format } from 'date-fns';
import api from '../../api/api';
import { FaSignInAlt, FaBed, FaUserCheck, FaEnvelopeOpenText } from 'react-icons/fa';

const DashboardWidget = ({ icon, title, value, change, color, isLoading, isLink = false, to = "/" }) => {
    const content = (
        <div className={`bg-admin-card p-6 rounded-lg shadow-md flex items-center justify-between ${isLink ? 'transition-all hover:shadow-xl hover:-translate-y-1' : ''}`}>
            <div>
                <p className="text-text-secondary text-sm font-medium">{title}</p>
                {isLoading ? <div className="h-9 w-24 bg-gray-200 rounded animate-pulse mt-1"></div> : (
                    <>
                        <p className="text-3xl font-bold text-text-dark mt-1">{value}</p>
                        {change && <p className={`text-xs mt-1 font-semibold ${color}`}>{change}</p>}
                    </>
                )}
            </div>
            <div className={`text-3xl ${color}`}>{icon}</div>
        </div>
    );

    if (isLink) {
        return <Link to={to}>{content}</Link>;
    }
    return content;
};


const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentGuests, setRecentGuests] = useState([]);
    const [newSubmissionsCount, setNewSubmissionsCount] = useState(0); // New state for submissions
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch dashboard stats AND submissions concurrently for speed
                const [statsRes, submissionsRes] = await Promise.all([
                    api.get('/dashboard'),
                    api.get('/submissions?status=New') // A new backend route might be needed for this filtering
                ]);
                
                setStats(statsRes.data);
                setRecentGuests(statsRes.data.recentGuests);
                setNewSubmissionsCount(submissionsRes.data.length); // Count the new messages
            } catch (error) { 
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // ... Helper functions and other logic ...
    const roomsAvailable = useMemo(() => stats.totalRooms ? (stats.totalRooms - stats.occupiedRooms) : 0, [stats]);
    const roomsReserved = useMemo(() => stats.occupiedRooms || 0, [stats]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* --- THE NEW, LINKED WIDGET --- */}
                <DashboardWidget icon={<FaEnvelopeOpenText />} title="New Submissions" value={newSubmissionsCount} color="text-admin-primary" isLoading={isLoading} isLink={true} to="/admin/submissions" />
                
                <DashboardWidget icon={<FaSignInAlt />} title="Today's Check In" value={stats.todaysCheckIns || 0} change="+24%" color="text-status-green-text" isLoading={isLoading} />
                <DashboardWidget icon={<FaBed />} title="Rooms Available" value={roomsAvailable} change={`Total: ${stats.totalRooms || 0}`} color="text-admin-primary" isLoading={isLoading} />
                <DashboardWidget icon={<FaUserCheck />} title="Rooms Reserved" value={roomsReserved} change={`${stats.occupancyRate || 0}% Occupancy`} color="text-admin-primary" isLoading={isLoading} />
            </div>
            <div className="mt-10">
                <h2 className="text-2xl font-bold text-text-dark mb-4">Guest List</h2>
                <div className="bg-admin-card rounded-lg shadow-md overflow-x-auto">
                    {isLoading ? (
                        <p className="p-4 text-center text-text-muted">Loading recent guests...</p>
                    ) : recentGuests.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-text-secondary">Guest Name</th>
                                    <th className="p-4 font-semibold text-text-secondary hidden sm:table-cell">Email</th>
                                    <th className="p-4 font-semibold text-text-secondary hidden md:table-cell">Joined On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentGuests.map(guest => (
                                    <tr key={guest._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                        <td className="p-4 font-medium text-text-dark">{guest.name}</td>
                                        <td className="p-4 text-text-muted hidden sm:table-cell">{guest.email}</td>
                                        <td className="p-4 text-sm text-text-muted hidden md:table-cell">
                                            {format(new Date(guest.createdAt), 'MMM dd, yyyy')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-center text-text-muted">No recent guests found.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;