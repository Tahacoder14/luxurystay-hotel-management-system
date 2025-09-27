import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- LAYOUTS ---
import GuestLayout from './components/common/GuestLayout';
import AdminLayout from './components/admin/layout/AdminLayout';
import StaffLayout from './components/staff/StaffLayout';

// --- PAGES ---
import HomePage from './components/guest/HomePage';
import CareerPage from './components/guest/CareerPage';
import RoomDetailsPage from './components/guest/RoomDetailsPage';
import BookingConfirmation from './components/guest/BookingConfirmation';
import LoginPage from './components/guest/LoginPage';
import SignupPage from './components/guest/SignupPage';
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

// --- PROTECTED ROUTE WRAPPERS ---
import StaffRoute from './components/routing/StaffRoute';
import AdminRoute from './components/routing/AdminRoute'; // Import the new AdminRoute

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* --- GUEST ROUTES --- */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/careers" element={<CareerPage />} />
            <Route path="/rooms/:id" element={<RoomDetailsPage />} />
            <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
          </Route>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* --- THE DEFINITIVE ADMIN ROUTE FIX --- */}
          {/* The entire AdminLayout and all its children are now wrapped in the AdminRoute.
              This guarantees that NO ONE can access any /admin/* page unless they are a logged-in Admin. */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
\                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="manage-bookings" element={<BookingManagement />} />
            <Route path="manage-rooms" element={<ManageRooms />} />
            <Route path="room-list" element={<RoomList />} />
            <Route path="manage-staff" element={<ManageStaff />} />
            <Route path="manage-guests" element={<ManageGuests />} />
            <Route path="manage-jobs" element={<ManageJobs />} />
            <Route path="view-applications" element={<ViewApplications />} />
          </Route>

          {/* --- STAFF ROUTES --- */}
          <Route
            path="/staff/dashboard"
            element={
              <StaffRoute>
                <StaffLayout />
              </StaffRoute>
            }
          >
            <Route index element={<StaffDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}
export default App;