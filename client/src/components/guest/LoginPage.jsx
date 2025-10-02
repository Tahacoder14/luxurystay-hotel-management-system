import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi'; // Importing email and lock icons from react-icons

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const res = await api.post('/auth/login', formData);
            login(res.data.user, res.data.token);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen flex-wrap">
            <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
                <div className="flex justify-center pt-12 md:-mb-24 md:justify-start md:pl-12">
                    <a href="/home" className="border-b-4 border-b-blue-700 pb-2 text-2xl font-bold text-gray-900">LuxuryStay</a>
                </div>
                <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
                    <p className="text-center text-3xl font-bold">Welcome</p>
                    <p className="mt-2 text-center">Login to access your account.</p>
                    <form onSubmit={onSubmit} className="flex flex-col pt-3 md:pt-8">
                        <div className="flex flex-col pt-4">
                            <div className="relative flex overflow-hidden rounded-lg border focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 transition">
                                <span className="inline-flex items-center border-r border-gray-300 bg-white px-3 text-sm text-gray-500">
                                    <FiMail className="w-4 h-4" />
                                </span>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={email} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full flex-1 appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
                                    placeholder="Email" 
                                />
                            </div>
                        </div>
                        <div className="mb-12 flex flex-col pt-4">
                            <div className="relative flex overflow-hidden rounded-lg border focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600 transition">
                                <span className="inline-flex items-center border-r border-gray-300 bg-white px-3 text-sm text-gray-500">
                                    <FiLock className="w-4 h-4" />
                                </span>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={password} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full flex-1 appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
                                    placeholder="Password" 
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                        
                        <motion.button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full rounded-lg bg-blue-700 px-4 py-2 text-center text-base font-semibold text-white shadow-md transition ease-in hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            {isLoading ? 'Logging in...' : 'Submit'}
                        </motion.button>
                    </form>
                    <div className="pt-12 pb-12 text-center">
                        <p className="whitespace-nowrap">
                            Don't have an account? <Link to="/signup" className="font-semibold underline">Register here.</Link>
                        </p>
                    </div>
                </div>
            </div>
            <div className="pointer-events-none hidden select-none bg-black shadow-2xl md:block md:w-2/2 lg:w-2/3">
                <img className="h-screen w-full object-cover opacity-90" src="/images/login.jpg" alt="Login background" />
            </div>
        </div>
    );
};

export default LoginPage;