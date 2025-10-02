import { motion } from 'framer-motion';
import { FaSwimmingPool, FaSpa, FaDumbbell, FaUtensils, FaWifi, FaParking } from 'react-icons/fa';

// Updated amenities data with enhanced descriptions
const amenitiesList = [
    {
        icon: <FaSwimmingPool />,
        title: "Infinity Pool",
        description: "Dive into luxury with our rooftop infinity pool, offering breathtaking city views and a serene escape."
    },
    {
        icon: <FaSpa />,
        title: "Serenity Spa",
        description: "Rejuvenate with world-class treatments in our tranquil spa, designed for ultimate relaxation."
    },
    {
        icon: <FaDumbbell />,
        title: "Fitness Center",
        description: "Stay fit with 24/7 access to cutting-edge equipment in our state-of-the-art gym."
    },
    {
        icon: <FaUtensils />,
        title: "Gourmet Dining",
        description: "Savor exquisite dishes crafted by award-winning chefs at our signature restaurant."
    },
    {
        icon: <FaWifi />,
        title: "High-Speed Wi-Fi",
        description: "Stay connected with complimentary, ultra-fast Wi-Fi available throughout the property."
    },
    {
        icon: <FaParking />,
        title: "Valet Parking",
        description: "Enjoy hassle-free, secure valet parking tailored for your convenience."
    }
];

// Container animation for staggered entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

// Item animation for smooth scaling and fade-in
const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const AmenitiesSection = () => {
    return (
        <section id="amenities" className="py-16 sm:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-primary">
                        World-Class Amenities
                    </h2>
                    <p className="mt-4 text-lg sm:text-xl text-brand-accent max-w-3xl mx-auto">
                        Experience unparalleled luxury with amenities designed to elevate your stay.
                    </p>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {amenitiesList.map((amenity, index) => (
                        <motion.div
                            key={index}
                            className="relative bg-white rounded-xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300"
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="text-4xl text-brand-primary">
                                    {amenity.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-brand-primary mb-2">
                                        {amenity.title}
                                    </h3>
                                    <p className="text-brand-accent text-sm sm:text-base leading-relaxed">
                                        {amenity.description}
                                    </p>
                                </div>
                            </div>
                            {/* Subtle decorative accent */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary rounded-l-xl"></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AmenitiesSection;