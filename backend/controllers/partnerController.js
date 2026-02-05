const User = require('../models/User');

// @desc    Send push notification invite (mock)
// @access  Internal
const sendNotification = (userId, message) => {
    // Placeholder for notification system
    console.log(`Notification to ${userId}: ${message}`);
};

// @desc    Invite a partner
// @route   POST /api/partners/invite
// @access  Private
const invitePartner = async (req, res) => {
    try {
        const { email } = req.body;
        const currentUser = await User.findById(req.user.id);
        const targetUser = await User.findOne({ email });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (targetUser.id === req.user.id) {
            return res.status(400).json({ message: 'You cannot invite yourself' });
        }

        // Check availability
        const existingConnection = currentUser.partners.find(p => p.user.toString() === targetUser.id);
        if (existingConnection) {
            if (existingConnection.status === 'ACCEPTED') {
                return res.status(400).json({ message: 'Already partners' });
            }
            return res.status(400).json({ message: 'Invitation already pending' });
        }

        // Add to current user's partners (outgoing)
        currentUser.partners.push({
            user: targetUser.id,
            status: 'PENDING',
            initiatedBy: req.user.id
        });
        await currentUser.save();

        // Add to target user's partners (incoming)
        targetUser.partners.push({
            user: req.user.id,
            status: 'PENDING',
            initiatedBy: req.user.id
        });
        await targetUser.save();

        res.status(200).json({ message: 'Invitation sent' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Accept partner invite
// @route   PUT /api/partners/accept
// @access  Private
const acceptInvite = async (req, res) => {
    try {
        const { partnerId } = req.body; // User ID of the partner
        const currentUser = await User.findById(req.user.id);
        const partnerUser = await User.findById(partnerId);

        if (!partnerUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update current user status
        const currentLink = currentUser.partners.find(p => p.user.toString() === partnerId);
        if (!currentLink) {
            return res.status(400).json({ message: 'No invitation found' });
        }
        currentLink.status = 'ACCEPTED';
        await currentUser.save();

        // Update partner user status
        const partnerLink = partnerUser.partners.find(p => p.user.toString() === req.user.id);
        if (partnerLink) {
            partnerLink.status = 'ACCEPTED';
            await partnerUser.save();
        }

        res.status(200).json({ message: 'Invitation accepted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject/Remove partner
// @route   DELETE /api/partners/:partnerId
// @access  Private
const removePartner = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const currentUser = await User.findById(req.user.id);
        const partnerUser = await User.findById(partnerId);

        // Remove from current user
        currentUser.partners = currentUser.partners.filter(p => p.user.toString() !== partnerId);
        await currentUser.save();

        // Remove from partner user
        if (partnerUser) {
            partnerUser.partners = partnerUser.partners.filter(p => p.user.toString() !== req.user.id);
            await partnerUser.save();
        }

        res.status(200).json({ message: 'Partner removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get partners
// @route   GET /api/partners
// @access  Private
const getPartners = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('partners.user', 'name email');
        res.status(200).json(user.partners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    invitePartner,
    acceptInvite,
    removePartner,
    getPartners
};
