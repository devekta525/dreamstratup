const express = require('express');
const router = express.Router();
const { getStartupKits, getStartupKit, createStartupKit, updateStartupKit, deleteStartupKit } = require('../controllers/startupKit.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getStartupKits);
router.get('/:id', getStartupKit);
router.post('/', protect, authorize('admin'), upload.single('image'), createStartupKit);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateStartupKit);
router.delete('/:id', protect, authorize('admin'), deleteStartupKit);

module.exports = router;
