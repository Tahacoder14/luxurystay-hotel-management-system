// --- Load Environment Variables ---
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

  // Routes Imports

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import staffRoutes from './routes/staffRoutes.js';

dotenv.config();

const app = express();

let isConnected = false;
if (!isConnected) {
  connectDB().then(() => {
    isConnected = true;
    console.log('MongoDB connected');
  }).catch((error) => {
    console.error('MongoDB connection error:', error);
  });
}

const allowedOrigins = [
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api', (req, res) => res.json({ message: 'Welcome to the LuxuryStay API' }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff', staffRoutes);

app.use(errorHandler);

// Uncomment for local dev
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`SUCCESS: Local server is running smoothly on port ${PORT}`));

export default app;