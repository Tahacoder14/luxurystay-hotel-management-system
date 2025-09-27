import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- THE FIX: The context itself was never created. ---
const AuthContext = createContext();

// The list of roles considered "staff"
const staffRoles = ['Receptionist', 'Housekeeping', 'Laundry', 'Manager', 'Admin'];

export const AuthProvider = ({ children }) => {
    // --- THE FIX: The state and navigate hooks were never initialized. ---
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check if user is already logged in on app load
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            // If localStorage is corrupted, clear it.
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        setUser(userData);

        // --- THE FIX: The redirection logic is now robust ---
        if (userData.role === 'Admin') {
            navigate('/admin');
        } else if (staffRoles.includes(userData.role)) {
            navigate('/staff/dashboard');
        } else {
            navigate('/'); // Default for Guests
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        // --- THE FIX: The Provider now correctly uses the created context and provides the correct values ---
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;