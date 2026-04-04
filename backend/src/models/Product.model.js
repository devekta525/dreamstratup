const mongoose = require('mongoose');
const slugify = require('slugify');

const bulkPricingTierSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  maxQty: { type: Number },
  price: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Product title is required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: [true, 'Description is required'] },
  category: { type: String, required: true, enum: ['Furniture Hardware', 'Sanitary', 'Electrical', 'Home Decor'] },
  subcategory: { type: String, default: '' },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  minPrice: { type: Number, required: [true, 'Minimum price is required'] },
  maxPrice: { type: Number, required: [true, 'Maximum price is required'] },
  bulkPricingTiers: [bulkPricingTierSchema],
  moq: { type: Number, required: true, default: 5, min: [5, 'Minimum order quantity cannot be less than 5'] },
  stock: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  specifications: { type: Map, of: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

productSchema.index({ category: 1, minPrice: 1 });
productSchema.index({ title: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
