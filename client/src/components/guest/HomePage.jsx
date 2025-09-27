import React from 'react';

// Import all the individual sections that make up your beautiful one-page layout
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import RoomsSection from './RoomsSection';
import AmenitiesSection from './AmenitiesSection';
import ContactSection from './ContactSection';

/**
 * HomePage Component
 * This is the heart of your guest-facing website. It assembles all the 
 * individual sections in the correct order to create a seamless,
 * scrollable one-page experience.
 */
const HomePage = () => {
  return (
    // Using a React.Fragment (<>) is a clean, professional way to group components
    // without adding an unnecessary div to the HTML.
    <>
      <HeroSection />
      
      {/* The main tag is semantically important for SEO and accessibility */}
      <main>
        <AboutSection />
        <RoomsSection />
        <AmenitiesSection />
        <ContactSection />
      </main>

      {/*
        NOTE: The Footer is intentionally NOT here.
        The GuestLayout component is now responsible for rendering the Footer,
        ensuring a consistent layout across ALL guest pages.
      */}
    </>
  );
};

export default HomePage;