const express = require('express');
const router = express.Router();
const { createProfile, getMyProfile, updateMyProfile } = require('../controllers/provider.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('vendor', 'admin'));

router.post('/profile', createProfile);
router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateMyProfile);

module.exports = router;
