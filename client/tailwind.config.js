/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
      },
    },
    extend: {
      // --- THE NEW, BEHANCE-INSPIRED PROFESSIONAL COLOR PALETTE ---
      colors: {
        // Core Admin Theme
        'admin-bg': '#F4F7FE',        // The light, slightly blueish-gray background
        'admin-primary': '#4A69FF',   // The main vibrant blue for accents and buttons
        'admin-card': '#FFFFFF',     // The clean white for cards and tables
        // Brand Colors
        'brand-primary': '#2D4263',   // Your Dark Slate Blue for Navbar/Footer
        'brand-accent': '#48B3AF',    // Your Vibrant Teal for Logos & Buttons
        'brand-light': '#F1F1F1',     // Light Cream for page backgrounds
        'brand-subtle': '#C8E3D4',    // Soft Mint for secondary accents
        'text-dark': '#1F2937',      // Rich dark gray for text
        'text-light': '#F9FAFB',     // Clean off-white for text on dark backgrounds
        'text-muted': '#6B7280',     // Muted gray for subtitles
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
};