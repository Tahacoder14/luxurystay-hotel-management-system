import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';

const Footer = () => {
    return (
        <footer className="relative mt-20 bg-brand-accent px-4 pt-20">
            <div className="absolute -top-10 left-1/2 h-16 w-16 -translate-x-1/2 rounded-xl border-4 border-brand-primary bg-white p-2">
                <ScrollLink to="hero" spy={true} smooth={true} duration={500} className="cursor-pointer">
                    <h2 className="text-xl font-serif font-bold text-brand-primary text-center leading-tight">
                        LS
                    </h2>
                </ScrollLink>
            </div>
            <nav aria-label="Footer Navigation" className="mx-auto mb-10 flex max-w-lg flex-col gap-10 text-center sm:flex-row sm:text-left">
                <ScrollLink to="hero" spy={true} smooth={true} duration={500} className="font-medium text-text-light hover:text-white transition-colors cursor-pointer">
                    Home
                </ScrollLink>
                <ScrollLink to="about" spy={true} smooth={true} duration={500} className="font-medium text-text-light hover:text-white transition-colors cursor-pointer">
                    About
                </ScrollLink>
                <ScrollLink to="services" spy={true} smooth={true} duration={500} className="font-medium text-text-light hover:text-white transition-colors cursor-pointer">
                    Services
                </ScrollLink>
                <ScrollLink to="contact" spy={true} smooth={true} duration={500} className="font-medium text-text-light hover:text-white transition-colors cursor-pointer">
                    Contact
                </ScrollLink>
                 <ScrollLink to="contact" spy={true} smooth={true} duration={500} className="font-medium text-text-light hover:text-white transition-colors cursor-pointer">
                    Careers
                </ScrollLink>

            </nav>
            <div className="flex justify-center space-x-6 mb-8">
                <a href="#" aria-label="Facebook" className="text-2xl text-text-light hover:text-white transition-colors"><FaFacebook /></a>
                <a href="#" aria-label="Twitter" className="text-2xl text-text-light hover:text-white transition-colors"><FaTwitter /></a>
                <a href="#" aria-label="Instagram" className="text-2xl text-text-light hover:text-white transition-colors"><FaInstagram /></a>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
            >
                <p className="py-10 text-center text-gray-300">
                    &copy; {new Date().getFullYear()} LuxuryStay Hotels. All Rights Reserved. | Created by Taha
                </p>
            </motion.div>
        </footer>
    );
};

export default Footer;