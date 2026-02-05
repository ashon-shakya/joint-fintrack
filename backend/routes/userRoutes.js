const express = require('express');
const router = express.Router();
const { addSpender, removeSpender } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/spenders', protect, addSpender);
router.delete('/spenders/:name', protect, removeSpender);

module.exports = router;
