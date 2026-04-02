const mongoose = require('mongoose');
const slugify = require('slugify');

const startupKitSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Kit title is required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  includedServices: [{ type: String }],
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

startupKitSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('StartupKit', startupKitSchema);
