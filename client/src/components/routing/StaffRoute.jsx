import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

// This is a professional "Protected Route" component.
const StaffRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // The list of roles that are considered "staff"
    const staffRoles = ['Receptionist', 'Housekeeping', 'Laundry', 'Manager', 'Admin'];

    // If the user data is still loading, you can show a loading spinner
    // For now, we'll just wait for the user object to exist.
    if (user === null) {
        // This prevents a brief flash of the login page while the app is starting
        return <div>Loading...</div>;
    }

    // If the user is logged in AND their role is in the staffRoles array, show the page.
    if (user && staffRoles.includes(user.role)) {
        return children;
    }

    // If the user is not a staff member, redirect them to the login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default StaffRoute;