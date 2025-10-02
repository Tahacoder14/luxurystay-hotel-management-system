import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/api';
import { FaPaperPlane, FaCommentDots, FaQuestionCircle } from 'react-icons/fa';

const ContactSection = () => {
    const initialState = { name: '', email: '', message: '', type: 'Inquiry' };
    const [formData, setFormData] = useState(initialState);
    const [feedback, setFeedback] = useState({ error: '', success: '' });
    const [isLoading, setIsLoading] = useState(false);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback({ error: '', success: '' });
        try {
            const res = await api.post('/submissions', formData);
            setFeedback({ success: res.data.message, error: '' });
            setFormData(initialState);
        } catch (err) {
            setFeedback({ error: 'Failed to send message. Please try again.', success: '' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-brand-light">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-brand-primary">Get In Touch</h2>
                    <p className="text-text-muted mt-2">Have a question or some feedback? We’d love to hear from you.</p>
                </div>
                <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="text-center">
                            <label className="text-lg font-semibold text-text-dark">I would like to...</label>
                            <div className="flex justify-center gap-4 mt-4">
                                <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${formData.type === 'Inquiry' ? 'bg-brand-subtle ring-2 ring-brand-accent' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    <input type="radio" name="type" value="Inquiry" checked={formData.type === 'Inquiry'} onChange={onChange} className="hidden"/>
                                    <FaQuestionCircle className={formData.type === 'Inquiry' ? 'text-brand-primary' : 'text-text-muted'} /> Make an Inquiry
                                </label>
                                <label className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${formData.type === 'Feedback' ? 'bg-brand-subtle ring-2 ring-brand-accent' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    <input type="radio" name="type" value="Feedback" checked={formData.type === 'Feedback'} onChange={onChange} className="hidden"/>
                                    <FaCommentDots className={formData.type === 'Feedback' ? 'text-brand-primary' : 'text-text-muted'} /> Provide Feedback
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} required className="w-full p-3 border rounded-md" />
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={onChange} required className="w-full p-3 border rounded-md" />
                        </div>
                        <textarea name="message" placeholder="Your Message..." value={formData.message} onChange={onChange} required rows="5" className="w-full p-3 border rounded-md"></textarea>
                        
                        {feedback.error && <p className="text-red-500 text-center">{feedback.error}</p>}
                        {feedback.success && <p className="text-green-500 text-center">{feedback.success}</p>}
                        
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 rounded-md hover:bg-slate-700 disabled:bg-gray-400">
                            <FaPaperPlane /> {isLoading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};
export default ContactSection;