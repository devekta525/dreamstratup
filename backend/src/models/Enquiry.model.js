const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['bulk_order', 'startup', 'general'] },
  name: { type: String, required: [true, 'Name is required'] },
  phone: { type: String, required: [true, 'Phone is required'] },
  email: { type: String },
  message: { type: String, required: [true, 'Message is required'] },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  startupKit: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupKit' },
  isResolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
