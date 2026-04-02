const express = require('express');
const router = express.Router();
const { getMyJobs, updateJobStatus } = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', authorize('vendor'), getMyJobs);
router.put('/:id/status', authorize('vendor', 'admin'), updateJobStatus);

module.exports = router;
