import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const HireModal = ({ application, isOpen, onClose, onConfirm }) => {
    const [staffTitle, setStaffTitle] = useState('');

    // This effect ensures the title is correctly set when the modal opens
    useEffect(() => {
        if (application) {
            setStaffTitle(application.job?.title || 'Staff');
        }
    }, [application]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(staffTitle);
    };

    // --- THE DEFINITIVE CRASH FIX ---
    // If the modal is not open, it renders nothing (null), preventing the error.
    if (!isOpen || !application) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-text-dark">Confirm Hire</h2>
                        <p className="text-text-muted mt-1">You are about to hire <strong>{application.name}</strong>.</p>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Assign Job Title</label>
                                <input type="text" value={staffTitle} onChange={(e) => setStaffTitle(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div className="flex justify-end gap-4 pt-2">
                                <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="py-2 px-6 rounded-md bg-green-500 text-white hover:bg-green-600">Confirm & Hire</button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
export default HireModal;