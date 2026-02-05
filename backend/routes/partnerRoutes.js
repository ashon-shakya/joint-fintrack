const express = require('express');
const router = express.Router();
const { invitePartner, acceptInvite, removePartner, getPartners } = require('../controllers/partnerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/invite', protect, invitePartner);
router.put('/accept', protect, acceptInvite);
router.delete('/:partnerId', protect, removePartner);
router.get('/', protect, getPartners);

module.exports = router;
