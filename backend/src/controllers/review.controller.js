const Review = require('../models/Review.model');
const Product = require('../models/Product.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/reviews/:productId
exports.getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name profileImage')
    .sort('-createdAt');
  res.json(new ApiResponse(200, reviews, 'Reviews fetched'));
});

// POST /api/reviews/:productId
exports.createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const existing = await Review.findOne({ product: req.params.productId, user: req.user.id });
  if (existing) throw new ApiError(400, 'You have already reviewed this product');

  const review = await Review.create({
    product: req.params.productId,
    user: req.user.id,
    rating: Number(rating),
    comment
  });

  await review.populate('user', 'name profileImage');
  res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
});

// PUT /api/reviews/:id
exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  let review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  review.rating = Number(rating) || review.rating;
  review.comment = comment || review.comment;
  await review.save();
  await review.populate('user', 'name profileImage');
  res.json(new ApiResponse(200, review, 'Review updated'));
});

// DELETE /api/reviews/:id
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  await Review.findByIdAndDelete(req.params.id);
  res.json(new ApiResponse(200, null, 'Review deleted'));
});
