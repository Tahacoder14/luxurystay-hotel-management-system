import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const GuestLayout = () => {
  return (
    // 'w-full' ensures the layout never exceeds the screen width.
    // 'min-h-screen' ensures the footer always stays at the bottom.
    <div className="w-full flex flex-col min-h-screen bg-brand-light">
      <Navbar />
      <main className="flex-grow">
        {/* --- THIS IS WHERE YOUR PAGE CONTENT WILL NOW APPEAR --- */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default GuestLayout;