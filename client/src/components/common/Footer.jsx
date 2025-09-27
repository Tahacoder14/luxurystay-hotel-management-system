import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';

const Footer = () => {
    return (
        // --- THE COLOR FIX ---
        // 'bg-brand-accent' ensures a perfect match with the new navbar.
        <footer className="bg-brand-accent text-text-light py-12">
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    <ScrollLink to="hero" spy={true} smooth={true} duration={500} className="cursor-pointer">
                        {/* The logo now uses the dark primary color for consistency */}
                        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">
                            LuxuryStay
                        </h2>
                    </ScrollLink>
                    <p className="max-w-md mx-auto mb-6 text-gray-200">
                        Experience the pinnacle of comfort and luxury. Your unforgettable stay is just a reservation away.
                    </p>
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="#" aria-label="Facebook" className="text-2xl hover:text-white transition-colors"><FaFacebook /></a>
                        <a href="#" aria-label="Twitter" className="text-2xl hover:text-white transition-colors"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram" className="text-2xl hover:text-white transition-colors"><FaInstagram /></a>
                    </div>
                    <p className="text-gray-300 text-sm">
                        &copy; {new Date().getFullYear()} LuxuryStay Hotels. All Rights Reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;