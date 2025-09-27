import { motion } from 'framer-motion';
import { FaSwimmingPool, FaSpa, FaDumbbell, FaWifi, FaUtensils, FaParking } from 'react-icons/fa';

// Dummy data for the amenities. This makes it clean and easy to add more later.
const amenitiesList = [
    {
        icon: <FaSwimmingPool />,
        title: "Infinity Pool",
        description: "Breathtaking city views from our stunning rooftop infinity pool."
    },
    {
        icon: <FaSpa />,
        title: "Serenity Spa",
        description: "Indulge in our world-class spa with a full range of revitalizing treatments."
    },
    {
        icon: <FaDumbbell />,
        title: "Fitness Center",
        description: "State-of-the-art equipment available 24/7 for your fitness needs."
    },
    {
        icon: <FaUtensils />,
        title: "Gourmet Dining",
        description: "Experience exquisite cuisine at our award-winning in-house restaurant."
    },
    {
        icon: <FaWifi />,
        title: "High-Speed Wi-Fi",
        description: "Complimentary high-speed internet access throughout the hotel."
    },
    {
        icon: <FaParking />,
        title: "Valet Parking",
        description: "Secure and convenient valet parking for all our esteemed guests."
    }
];

// Animation variant for the container to orchestrate staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2 // This will make each child animate 0.2s after the previous one
        }
    }
};

// Animation variant for each amenity item
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const AmenitiesSection = () => {
    return (
        <section id="amenities" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-serif font-bold text-primary mb-2">Unparalleled Amenities</h2>
                <p className="text-text-dark max-w-2xl mx-auto mb-12">Every detail is crafted for your comfort and delight.</p>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the section is in view
                >
                    {amenitiesList.map((amenity, index) => (
                        <motion.div
                            key={index}
                            className="bg-light-bg p-8 rounded-lg shadow-md text-left flex items-start space-x-4"
                            variants={itemVariants}
                        >
                            <div className="text-secondary text-4xl">
                                {amenity.icon}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-primary mb-2">{amenity.title}</h3>
                                <p className="text-text-dark">{amenity.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AmenitiesSection;