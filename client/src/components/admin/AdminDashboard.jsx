import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import api from '../../api/api';
import { FaSignInAlt, FaSignOutAlt, FaBed, FaUserCheck } from 'react-icons/fa';

// A reusable, professional Widget component with a skeleton loading state
const DashboardWidget = ({ icon, title, value, change, color, isLoading }) => (
    <div className="bg-admin-card p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
            <p className="text-text-secondary text-sm font-medium">{title}</p>
            {isLoading ? (
                <div className="h-9 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
            ) : (
                <>
                    <p className="text-3xl font-bold text-text-dark mt-1">{value}</p>
                    <p className={`text-xs mt-1 font-semibold ${color}`}>{change}</p>
                </>
            )}
        </div>
        <div className={`text-3xl ${color}`}>{icon}</div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentGuests, setRecentGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data from our single, efficient endpoint
                const res = await api.get('/dashboard');
                setStats(res.data);
                setRecentGuests(res.data.recentGuests);
            } catch (error) { 
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // Helper to prevent NaN errors before data is loaded
    const roomsAvailable = stats.totalRooms ? (stats.totalRooms - stats.occupiedRooms) : 0;
    const roomsReserved = stats.occupiedRooms || 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-text-dark mb-6">Overview</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardWidget icon={<FaSignInAlt />} title="Today's Check In" value={stats.todaysCheckIns || 0} change="+24% Last 7 Days" color="text-status-green-text" isLoading={isLoading} />
                <DashboardWidget icon={<FaSignOutAlt />} title="Today's Check Out" value="21" change="-11% Last 7 Days" color="text-status-red-text" isLoading={isLoading} />
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