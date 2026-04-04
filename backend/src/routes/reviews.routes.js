const express = require('express');
const router = express.Router();
const { getProductReviews, createReview, updateReview, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
