const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Is the endpoint name spelled correctly? 'register'
router.post('/register', registerUser); 
router.post('/login', loginUser);

module.exports = router;