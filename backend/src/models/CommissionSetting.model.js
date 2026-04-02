const mongoose = require('mongoose');

const commissionSettingSchema = new mongoose.Schema({
  profession: { type: String, required: true, unique: true, enum: ['carpenter', 'electrician', 'plumber'] },
  defaultCommissionRate: { type: Number, required: true, default: 10 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CommissionSetting', commissionSettingSchema);
