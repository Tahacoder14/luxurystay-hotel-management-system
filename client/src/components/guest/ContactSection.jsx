import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

// Animation variants for the two columns
const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.2 } },
};


const ContactSection = () => {
    return (
        <section id="contact" className="py-20 bg-light-bg">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-primary">Get In Touch</h2>
                    <p className="text-text-dark mt-2">We would be delighted to hear from you. Please get in touch with any inquiries.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Left Column: Contact Information */}
                    <motion.div
                        className="space-y-6"
                        variants={slideInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="flex items-start space-x-4">
                            <FaMapMarkerAlt className="text-secondary text-2xl mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-primary">Our Address</h3>
                                <p className="text-text-dark">123 Luxury Avenue, Elegance City, 12345</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaPhone className="text-secondary text-2xl mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-primary">Phone Number</h3>
                                <p className="text-text-dark">Reservations: (123) 456-7890</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <FaEnvelope className="text-secondary text-2xl mt-1" />
                            <div>
                                <h3 className="text-xl font-bold text-primary">Email</h3>
                                <p className="text-text-dark">concierge@luxurystay.com</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        variants={slideInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <form className="bg-white p-8 rounded-lg shadow-lg space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text-dark">Full Name</label>
                                <input type="text" id="name" className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent transition" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-dark">Email Address</label>
                                <input type="email" id="email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent transition" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text-dark">Message</label>
                                <textarea id="message" rows="5" className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-secondary focus:border-transparent transition"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-gray-800 transition-colors transform hover:scale-105">
                                Send Message
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;