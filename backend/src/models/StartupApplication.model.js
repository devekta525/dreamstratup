const mongoose = require('mongoose');

const startupApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: [true, 'Full name is required'] },
  phone: { type: String, required: [true, 'Phone is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  city: { type: String, required: true },
  state: { type: String, required: true },
  businessType: { type: String, required: true },
  selectedKit: { type: mongoose.Schema.Types.ObjectId, ref: 'StartupKit', required: true },
  budget: { type: String },
  message: { type: String },
  status: { type: String, enum: ['pending', 'contacted', 'approved', 'rejected', 'completed'], default: 'pending' },
  adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('StartupApplication', startupApplicationSchema);
