const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProviderProfile', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: [true, 'Job title is required'] },
  description: { type: String },
  serviceType: { type: String, required: true, enum: ['carpenter', 'electrician', 'plumber'] },
  location: { type: String },
  scheduledDate: { type: Date },
  status: { type: String, enum: ['open', 'assigned', 'in_progress', 'completed', 'cancelled'], default: 'open' },
  commissionAmount: { type: Number, default: 0 },
  earningsAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
