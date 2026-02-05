const express = require('express');
const router = express.Router();
const {
    getRecords,
    createRecord,
    deleteRecord,
    importRecords,
    deleteMultipleRecords,
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRecords).post(protect, createRecord);
router.delete('/:id', protect, deleteRecord);
router.post('/import', protect, importRecords);
router.post('/delete-multiple', protect, deleteMultipleRecords);

module.exports = router;
