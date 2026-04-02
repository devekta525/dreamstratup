const ServiceProviderProfile = require('../models/ServiceProviderProfile.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.createProfile = asyncHandler(async (req, res) => {
  const existing = await ServiceProviderProfile.findOne({ user: req.user.id });
  if (existing) throw new ApiError(400, 'Profile already exists');
  req.body.user = req.user.id;
  const profile = await ServiceProviderProfile.create(req.body);
  res.status(201).json(new ApiResponse(201, profile, 'Provider profile created'));
});

exports.getMyProfile = asyncHandler(async (req, res) => {
  const profile = await ServiceProviderProfile.findOne({ user: req.user.id }).populate('user', 'name email phone');
  if (!profile) throw new ApiError(404, 'Profile not found');
  res.json(new ApiResponse(200, profile, 'Provider profile'));
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
  const { profession, experienceYears, serviceAreas, skills, available } = req.body;
  const profile = await ServiceProviderProfile.findOneAndUpdate(
    { user: req.user.id },
    { profession, experienceYears, serviceAreas, skills, available },
    { new: true, runValidators: true }
  );
  if (!profile) throw new ApiError(404, 'Profile not found');
  res.json(new ApiResponse(200, profile, 'Profile updated'));
});

exports.getAllProviders = asyncHandler(async (req, res) => {
  const { profession, approved, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (profession) filter.profession = profession;
  if (approved !== undefined) filter.isApproved = approved === 'true';
  const skip = (Number(page) - 1) * Number(limit);
  const [providers, total] = await Promise.all([
    ServiceProviderProfile.find(filter)
      .populate('user', 'name email phone city')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    ServiceProviderProfile.countDocuments(filter)
  ]);
  res.json(new ApiResponse(200, { providers, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'All providers'));
});

exports.approveProvider = asyncHandler(async (req, res) => {
  const { isApproved, commissionRate } = req.body;
  const update = {};
  if (isApproved !== undefined) update.isApproved = isApproved;
  if (commissionRate !== undefined) update.commissionRate = commissionRate;
  const profile = await ServiceProviderProfile.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!profile) throw new ApiError(404, 'Provider not found');
  res.json(new ApiResponse(200, profile, 'Provider updated'));
});
