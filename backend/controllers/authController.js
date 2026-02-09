const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { getVerificationEmail, getPasswordResetEmail } = require('../utils/emailTemplates');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Create user (password hashing is handled by pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            verificationToken,
            isVerified: false
        });

        if (user) {
            // Send verification email
            const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`; // Frontend URL will be different, adjusting to point to frontend
            // Actually, usually we point to frontend which then calls backend. 
            // Let's assume frontend route is /verify-email/:token

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;

            const message = `Please verify your email by clicking the link: ${verifyUrl}`;
            const html = getVerificationEmail(user.name, verifyUrl);

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Email Verification - OurWallet',
                    message,
                    html,
                });

                res.status(201).json({
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    message: 'Please check your email to verify your account'
                });
            } catch (error) {
                console.error(error);
                // We should probably delete the user if email functionality fails so they can try again, 
                // but for now let's just return error
                res.status(500).json({ message: 'Email could not be sent' });
            }

        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.params.token;

        const user = await User.findOne({ verificationToken });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }

            // Populate partners before sending response
            await user.populate('partners.user', 'name email');

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                partners: user.partners,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You requested a password reset. Please click: ${resetUrl}`;
        const html = getPasswordResetEmail(user.name, resetUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset - OurWallet',
                message,
                html,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            console.error(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resend Verification Email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;

        const message = `Please verify your email by clicking the link: ${verifyUrl}`;
        const html = getVerificationEmail(user.name, verifyUrl);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification - OurWallet',
                message,
                html,
            });

            res.status(200).json({ message: 'Verification email sent' });
        } catch (error) {
            console.error(error);
            user.verificationToken = undefined;
            await user.save();
            res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, data: 'Password updated' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerificationEmail
};
