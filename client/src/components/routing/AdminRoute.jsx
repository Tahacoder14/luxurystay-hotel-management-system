import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 * AdminRoute - A professional protected route component.
 * This component acts as a security guard for the admin section of the application.
 */
const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // While the app is initializing, the user object might be null for a moment.
    // We can show a simple loading state to prevent a brief flash of the login page.
    if (user === null) {
        // You can replace this with a more sophisticated loading spinner component if you wish.
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    // --- The Core Security Logic ---
    // Check if a user exists AND if their role is 'Admin'.
    if (user && user.role === 'Admin') {
        // If they are an authenticated Admin, allow them to see the page.
        return children;
    }

    // --- The Redirect Logic ---
    // If the user is not an authenticated Admin for any reason (not logged in, wrong role),
    // redirect them to the login page.
    // The 'state={{ from: location }}' is a professional touch: it remembers the page
    // the user was trying to access, so they can be redirected back after a successful login.
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;