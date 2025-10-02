import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { name, email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const res = await api.post('/auth/register', formData);
            setSuccess(res.data.message + ' Redirecting to login...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-screen min-h-screen flex-wrap text-slate-800">
            <div className="relative hidden h-screen select-none flex-col justify-center bg-blue-600 text-center md:flex md:w-1/2">
                <div className="mx-auto py-16 px-8 text-white xl:w-[40rem]">
                    <span className="rounded-full bg-white px-3 py-1 font-medium text-blue-600">New Feature</span>
                    <p className="my-6 text-3xl font-semibold leading-10">Discover Luxury Worldwide <span className="mx-auto block w-56 whitespace-nowrap rounded-lg bg-orange-400 py-2 text-white">with LuxuryStay</span></p>
                    <p className="mb-4">Experience unparalleled comfort and elegance in our global hotels.</p>
                    <img className="mx-auto mt-8 w-11/12 max-w-lg rounded-lg object-cover" src="/images/signup.jpg" alt="LuxuryStay background" />
                </div>
            </div>
            <div className="flex w-full flex-col md:w-1/2">
                <div className="flex justify-center pt-12 md:justify-start md:pl-12">
                    <a href="/home" className="text-2xl font-bold text-blue-600">LuxuryStay</a>
                </div>
                <div className="my-auto mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
                    <p className="text-center text-3xl font-bold md:text-left md:leading-tight">Create your free account</p>
                    <p className="mt-6 text-center font-medium md:text-left">
                        Already using LuxuryStay? <Link to="/login" className="whitespace-nowrap font-semibold text-blue-700">Login here</Link>
                    </p>
                    <form onSubmit={onSubmit} className="flex flex-col items-stretch pt-3 md:pt-8">
                        <div className="flex flex-col pt-4">
                            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={name} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
                                    placeholder="Name" 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col pt-4">
                            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={email} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
                                    placeholder="Email" 
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col pt-4">
                            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={password} 
                                    onChange={onChange} 
                                    required 
                                    minLength="6" 
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none" 
                                    placeholder="Password (minimum 8 characters)" 
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
                        {!success && (
                            <motion.button 
                                type="submit" 
                                disabled={isLoading}
                                className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </motion.button>
                        )}
                    </form>
                    {success && <p className="text-center text-green-500 bg-green-100 p-4 rounded-md">{success}</p>}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;