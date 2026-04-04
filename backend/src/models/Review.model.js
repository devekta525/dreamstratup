const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
  comment: { type: String, required: [true, 'Review comment is required'], trim: true, maxlength: 1000 },
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method: calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  const Product = mongoose.model('Product');
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRating: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].numReviews
    });
  } else {
    await Product.findByIdAndUpdate(productId, { avgRating: 0, numReviews: 0 });
  }
};

// Recalculate after save and remove
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) doc.constructor.calcAverageRating(doc.product);
});

module.exports = mongoose.model('Review', reviewSchema);
