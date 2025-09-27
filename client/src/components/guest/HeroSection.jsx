import { motion } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';

const HeroSection = () => {
    return (
        // --- THE DEFINITIVE LAYOUT STRUCTURE ---
        // 1. The main container is 'relative' and 'h-screen'. This is our canvas.
        <section id="hero" className="relative h-screen">
            
            {/* --- LAYER 1: The Fixed Background Image --- */}
            {/* It is 'absolute', filling the entire section. 'bg-fixed' creates the parallax effect. */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url('/images/hotel-hero.jpg')` }}
            />

            {/* --- LAYER 2: The Dark Overlay --- */}
            {/* Sits on top of the image to make the text pop. */}
            <div className="absolute inset-0 bg-black bg-opacity-50" />

            {/* --- LAYER 3: The Centered Content --- */}
            {/* 'relative z-10' places it on top. 'h-full flex...' perfectly centers the content. */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
                <motion.h1 
                    // Professional, responsive typography
                    className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg"
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.8 }}
                >
                    Experience Unmatched <span className="text-brand-accent">Luxury</span>
                </motion.h1>
                
                <motion.p
                    className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-200"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Your perfect getaway awaits. Discover a world of comfort, elegance, and service.
                </motion.p>
                
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
                    <ScrollLink to="rooms" spy={true} smooth={true} offset={-70} duration={500}>
                        <button className="bg-brand-accent text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-teal-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Explore Our Rooms
                        </button>
                    </ScrollLink>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;