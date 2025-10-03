import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- LAYOUTS ---
import GuestLayout from './components/common/GuestLayout';
import AdminLayout from './components/admin/layout/AdminLayout';
import StaffLayout from './components/staff/StaffLayout';

// --- GUEST & AUTH PAGES ---
import HomePage from './components/guest/HomePage';
import CareerPage from './components/guest/CareerPage';
import RoomDetailsPage from './components/guest/RoomDetailsPage';
import BookingConfirmation from './components/guest/BookingConfirmation';
import LoginPage from './components/guest/LoginPage';
import SignupPage from './components/guest/SignupPage';

// --- STAFF PAGES ---
import StaffDashboard from './components/staff/StaffDashboard';

// --- ADMIN PAGES ---
import AdminDashboard from './components/admin/AdminDashboard';
import ManageRooms from './components/admin/ManageRooms';
import RoomList from './components/admin/RoomList';
import ManageStaff from './components/admin/ManageStaff';
import ManageGuests from './components/admin/ManageGuests';
import ManageJobs from './components/admin/ManageJobs';
import ViewApplications from './components/admin/ViewApplications';
import BookingManagement from './components/admin/BookingManagement';
import ViewSubmissions from './components/admin/ViewSubmissions'; // Correctly imported

// --- PROTECTED ROUTE WRAPPERS ---
import StaffRoute from './components/routing/StaffRoute';
import AdminRoute from './components/routing/AdminRoute';

// A simple component to handle which layout to show based on the URL.
const AppContent = () => {
    return (
        <Routes>
            {/* --- GUEST ROUTES (wrapped in GuestLayout) --- */}
            <Route element={<GuestLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/careers" element={<CareerPage />} />
            {/* A standalone '/rooms' route is not needed, as the homepage contains the RoomsSection */}
            <Route path="/rooms/:id" element={<RoomDetailsPage />} />
            <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
            </Route>

            
            {/* --- AUTH ROUTES (standalone) --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* --- ADMIN ROUTES (protected and nested in AdminLayout) --- */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="manage-bookings" element={<BookingManagement />} />
                <Route path="manage-rooms" element={<ManageRooms />} />
                <Route path="room-list" element={<RoomList />} />
                <Route path="manage-staff" element={<ManageStaff />} />
                <Route path="manage-guests" element={<ManageGuests />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="view-applications" element={<ViewApplications />} />
                
                {/* --- THE DEFINITIVE ROUTE FIX --- */}
                {/* The path is now correctly set to 'submissions' to match the link */}
                <Route path="submissions" element={<ViewSubmissions />} />
            </Route>

            {/* --- STAFF ROUTES (protected and nested in StaffLayout) --- */}
            <Route path="/staff/dashboard" element={<StaffRoute><StaffLayout /></StaffRoute>}>
                <Route index element={<StaffDashboard />} />
            </Route>
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;