// Use require for classic Node.js compatibility on Vercel
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// --- Import All Route Handlers ---
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const staffRoutes = require('./routes/staffRoutes');

// --- Initializations ---
dotenv.config();
const app = express();

// --- Connect to MongoDB ---
// This is the first thing that happens when the function is invoked.
// If the MONGO_URI is missing, it will cause an error here.
connectDB();
// Connect to MongoDB once during initialization (not per request)
let isConnected = false;
if (!isConnected) {
  connectDB().then(() => {
    isConnected = true;
    console.log('MongoDB connected');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
}
// Setup a professional CORS policy to allow requests from specific origins.
const allowedOrigins = [
  'http://localhost:3000',                       // Local development
];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true, // Include if using cookies/auth tokens
};




// --- Core Middleware ---
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // To parse form data
// Configure Express to parse large JSON request bodies for image uploads.
app.use(express.json({ limit: '50mb' }));


// --- Static Folder for Image Uploads ---
// This serves your images from the '/uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Mount API Routes ---
app.get('/api', (req, res) => res.json({ message: 'Welcome to the LuxuryStay API' }));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);

// --- Central Error Handling ---
// This must be the LAST middleware you use.
app.use(errorHandler);

// --- Export for Vercel ---
// We do NOT call app.listen(). Vercel handles the server creation.
// We simply export the configured Express app.
module.exports = app;