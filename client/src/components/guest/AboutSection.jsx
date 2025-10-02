import { motion } from 'framer-motion';
import React from 'react';

const AboutSection = () => {
    return (
        <section id="about" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img 
                                src="/images/hotel-lobby.jpg" 
                                alt="Elegant interior of the LuxuryStay hotel lobby" 
                                className="rounded-lg shadow-lg w-full h-64 object-cover" 
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img 
                                src="/images/luxury-suite.jpg"
                                alt="Luxurious suite at LuxuryStay"
                                className="rounded-lg shadow-lg w-full h-64 object-cover mt-6 md:mt-0" 
                            />
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                            About Us at LuxuryStay
                        </h2>
                        <div className="w-16 h-1 bg-blue-600 mb-6"></div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            LuxuryStay is your premier destination for exceptional hospitality, offering world-class hotels and the best accommodations across the globe. With branches in every corner of the world, we bring unparalleled comfort and elegance to every stay.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Our commitment to excellence shines through in our meticulously designed rooms, state-of-the-art amenities, and personalized guest services. Whether you're seeking a relaxing getaway or a business retreat, LuxuryStay ensures an unforgettable experience.
                        </p>
                        <a href="/contact" className="inline-block to-brand-accent text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300">
                            Know More
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;