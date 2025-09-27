import React, { useState } from 'react'; // We only need React and useState here
import { motion } from 'framer-motion';
import api from '../../api/api'; // The api instance handles authentication

const ManageRooms = () => {
    // Initial state for the form fields
    const initialState = { name: '', type: 'Deluxe', price: '', description: '', status: 'Available' };
    const [formData, setFormData] = useState(initialState);
    const [image, setImage] = useState(null);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(false);

    // --- LOGIC FUNCTIONS ---
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = (e) => setImage(e.target.files[0]);

    const setTempFeedback = (message, isError = false) => {
        if (isError) setFeedback({ error: message, success: '' });
        else setFeedback({ error: '', success: message });
        setTimeout(() => setFeedback({ error: '', success: '' }), 5000); // Clear feedback after 5 seconds
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setFeedback({ error: '', success: '' }); // Clear old feedback
        if (!image) {
            setTempFeedback('Please select an image file to upload.', true);
            return;
        }
        setIsLoading(true); // Start loading state

        const roomData = new FormData();
        roomData.append('image', image);
        Object.keys(formData).forEach(key => roomData.append(key, formData[key]));

        try {
            await api.post('/rooms', roomData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setTempFeedback('Room added successfully!');
            setFormData(initialState); // Reset form fields
            setImage(null);
            e.target.reset(); // Reset the file input field
        } catch (err) {
            setTempFeedback(err.response?.data?.message || 'Failed to add room. Please check all fields.', true);
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-primary mb-6">Add a New Room</h1>
            
            {feedback.error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 animate-pulse">{feedback.error}</p>}
            {feedback.success && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{feedback.success}</p>}

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Room Name</label>
                            <input type="text" name="name" onChange={onChange} value={formData.name} required className="mt-1 w-full p-3 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Price per Night ($)</label>
                            <input type="number" name="price" onChange={onChange} value={formData.price} required className="mt-1 w-full p-3 border rounded-md" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Room Type</label>
                            <select name="type" onChange={onChange} value={formData.type} className="mt-1 w-full p-3 border rounded-md">
                                <option>Single</option><option>Double</option><option>Suite</option><option>Deluxe</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Initial Status</label>
                            <select name="status" onChange={onChange} value={formData.status} className="mt-1 w-full p-3 border rounded-md">
                                <option>Available</option><option>Cleaning</option><option>Maintenance</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea name="description" onChange={onChange} value={formData.description} required rows="4" className="mt-1 w-full p-3 border rounded-md"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Room Image</label>
                        <input type="file" onChange={onFileChange} required className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-primary hover:file:bg-amber-200" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Processing...' : 'Add Room'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ManageRooms;