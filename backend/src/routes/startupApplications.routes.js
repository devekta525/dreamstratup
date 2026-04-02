const express = require('express');
const router = express.Router();
const { submitApplication, getMyApplications } = require('../controllers/startupApplication.controller');
const { protect } = require('../middleware/auth');

router.post('/', submitApplication);
router.get('/my', protect, getMyApplications);

module.exports = router;
