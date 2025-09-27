import { motion } from 'framer-motion';
import Navbar from '../common/Navbar';

// We NO LONGER need to import the image here.
<Navbar />
const AboutSection = () => {
    return (
        <section id="about" className="py-16 md:py-20 bg-brand-light">
            {/* The 'container' class automatically handles responsive padding */}
            <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                
                {/* --- Image Column --- */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* --- THE IMAGE FIX --- */}
                    {/* The 'src' now points directly to the public folder */}
                    <img 
                        src="/images/hotel-lobby.jpg" 
                        alt="Elegant interior of the LuxuryStay hotel lobby" 
                        className="rounded-lg shadow-2xl w-full" 
                    />
                </motion.div>

                {/* --- Text Content Column --- */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* --- RESPONSIVE TYPOGRAPHY --- */}
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">
                        Discover Our Story
                    </h2>

                    {/* --- PROFESSIONAL ACCENT --- */}
                    <div className="w-24 h-1 bg-brand-gold mb-6"></div>

                    <p className="text-text-secondary leading-relaxed mb-4">
                        Nestled in the heart of the city, LuxuryStay offers a serene escape from the everyday. We are dedicated to providing an experience that blends timeless elegance with modern comfort.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                        Our commitment to excellence is reflected in every detail, from our meticulously designed rooms to our world-class amenities and personalized guest services.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;