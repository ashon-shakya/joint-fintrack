const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);
router.post('/forgotpassword', forgotPassword);
router.post('/resend-verification', resendVerificationEmail);
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
