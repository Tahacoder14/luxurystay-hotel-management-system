import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom'; // No longer need useNavigate
import AuthContext from '../../context/AuthContext'; // Import the AuthContext

const LoginPage = () => {
    // Get the login function from our global context
    const { login } = useContext(AuthContext); 
    
    // Local state for the form inputs and error messages
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError(''); // Clear previous errors on a new submission
        try {
            // Send login credentials to the backend
                const res = await axios.post('http://localhost:5001/api/auth/login', formData);
            
            // On success, call the global login function from the context.
            // This will handle saving the token, setting the user, and redirecting.
            login(res.data.user, res.data.token);

        } catch (err) {
            // If the API call fails, display the error message from the server
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg p-4">
            <motion.div 
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <h2 className="text-3xl font-bold font-serif text-primary mb-6 text-center">Welcome Back</h2>
                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary" />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <motion.button 
                        type="submit" 
                        className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Login
                    </motion.button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account? <Link to="/signup" className="font-medium text-secondary hover:underline">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;