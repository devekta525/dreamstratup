const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  profession: { type: String, required: true, enum: ['carpenter', 'electrician', 'plumber'] },
  experienceYears: { type: Number, default: 0 },
  serviceAreas: [{ type: String }],
  skills: [{ type: String }],
  aadhaarNumber: { type: String },
  isApproved: { type: Boolean, default: false },
  commissionRate: { type: Number, default: 10 },
  earnings: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceProviderProfile', providerSchema);
