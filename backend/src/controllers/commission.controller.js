const CommissionSetting = require('../models/CommissionSetting.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.getCommissions = asyncHandler(async (req, res) => {
  const commissions = await CommissionSetting.find();
  res.json(new ApiResponse(200, commissions, 'Commission settings'));
});

exports.createCommission = asyncHandler(async (req, res) => {
  const existing = await CommissionSetting.findOne({ profession: req.body.profession });
  if (existing) throw new ApiError(400, 'Commission setting already exists for this profession');
  const commission = await CommissionSetting.create(req.body);
  res.status(201).json(new ApiResponse(201, commission, 'Commission setting created'));
});

exports.updateCommission = asyncHandler(async (req, res) => {
  const commission = await CommissionSetting.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!commission) throw new ApiError(404, 'Commission setting not found');
  res.json(new ApiResponse(200, commission, 'Commission setting updated'));
});
