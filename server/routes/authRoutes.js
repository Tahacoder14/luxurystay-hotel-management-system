import express from 'express';
const router = express.Router();
import { registerUser, loginUser } from '../controllers/authController.js';

// Is the endpoint name spelled correctly? 'register'
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;