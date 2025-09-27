const express = require('express');
const router = express.Router();
const { createUpdate, getAllUpdates } = require('../controllers/updateController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createUpdate);
router.get('/', protect, staff, getAllUpdates);

module.exports = router;