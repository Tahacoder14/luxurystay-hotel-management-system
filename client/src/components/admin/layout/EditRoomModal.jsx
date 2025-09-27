import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EditRoomModal = ({ room, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...room });

    useEffect(() => {
        setFormData({ ...room }); // Update form if the selected room changes
    }, [room]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!room) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-lg"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-primary mb-4">Edit Room: {room.name}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Room Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Price per Night ($)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 w-full p-2 border rounded-md"></textarea>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-gray-600 hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="py-2 px-4 rounded-md bg-primary text-white hover:bg-gray-800">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditRoomModal;