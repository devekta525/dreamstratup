const Job = require('../models/Job.model');
const ServiceProviderProfile = require('../models/ServiceProviderProfile.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  res.status(201).json(new ApiResponse(201, job, 'Job created'));
});

exports.getMyJobs = asyncHandler(async (req, res) => {
  const profile = await ServiceProviderProfile.findOne({ user: req.user.id });
  if (!profile) throw new ApiError(404, 'Provider profile not found');
  const jobs = await Job.find({ provider: profile._id })
    .populate('customer', 'name phone')
    .sort('-createdAt');
  res.json(new ApiResponse(200, jobs, 'My jobs'));
});

exports.updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const job = await Job.findById(req.params.id);
  if (!job) throw new ApiError(404, 'Job not found');

  job.status = status;
  if (status === 'completed') {
    const provider = await ServiceProviderProfile.findById(job.provider);
    if (provider) {
      job.commissionAmount = (job.earningsAmount * provider.commissionRate) / 100;
      provider.earnings += job.earningsAmount - job.commissionAmount;
      await provider.save();
    }
  }
  await job.save();
  res.json(new ApiResponse(200, job, 'Job status updated'));
});

exports.getAllJobs = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('provider')
      .populate('customer', 'name phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Job.countDocuments(filter)
  ]);
  res.json(new ApiResponse(200, { jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'All jobs'));
});
