import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { name, email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5001/api/auth/register', formData);
            // After successful registration, redirect to login page
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg p-4">
            <motion.div 
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold font-serif text-primary mb-6 text-center">Create Your Account</h2>
                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-dark">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required minLength="6" className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-secondary" />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <motion.button 
                        type="submit" 
                        className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign Up
                    </motion.button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <Link to="/login" className="font-medium text-secondary hover:underline">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignupPage;