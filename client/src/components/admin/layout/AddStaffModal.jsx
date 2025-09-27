import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/api';
import { FaTimes } from 'react-icons/fa';

const AddStaffModal = ({ isOpen, onClose, onStaffAdded }) => {
    const initialState = { name: '', email: '', password: '', role: 'Receptionist', title: '' };
    const [formData, setFormData] = useState(initialState);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await api.post('/users/staff', formData);
            onStaffAdded(res.data); // Pass the new staff member back to the parent
            onClose(); // Close the modal on success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add staff member.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-lg shadow-xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-brand-primary mb-4">Add New Staff Member</h2>
                            <form onSubmit={onSubmit} className="space-y-4">
                                <input type="text" name="name" placeholder="Full Name" onChange={onChange} required className="w-full p-2 border rounded"/>
                                <input type="email" name="email" placeholder="Email Address" onChange={onChange} required className="w-full p-2 border rounded"/>
                                <input type="password" name="password" placeholder="Temporary Password" onChange={onChange} required className="w-full p-2 border rounded"/>
                                <select name="role" onChange={onChange} value={formData.role} className="w-full p-2 border rounded">
                                    <option>Receptionist</option><option>Housekeeping</option><option>Laundry</option><option>Manager</option>
                                </select>
                                <input type="text" name="title" placeholder="Job Title (e.g., Front Desk Manager)" onChange={onChange} required className="w-full p-2 border rounded"/>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="flex justify-end gap-4 pt-2">
                                    <button type="button" onClick={onClose} className="py-2 px-4 rounded">Cancel</button>
                                    <button type="submit" disabled={isLoading} className="py-2 px-6 rounded bg-brand-primary text-white disabled:bg-gray-400">{isLoading ? 'Adding...' : 'Add Staff'}</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default AddStaffModal;