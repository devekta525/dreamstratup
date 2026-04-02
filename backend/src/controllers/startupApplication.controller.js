const StartupApplication = require('../models/StartupApplication.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.submitApplication = asyncHandler(async (req, res) => {
  if (req.user) req.body.user = req.user.id;
  const application = await StartupApplication.create(req.body);
  res.status(201).json(new ApiResponse(201, application, 'Application submitted'));
});

exports.getMyApplications = asyncHandler(async (req, res) => {
  const apps = await StartupApplication.find({ user: req.user.id })
    .populate('selectedKit', 'title')
    .sort('-createdAt');
  res.json(new ApiResponse(200, apps, 'My applications'));
});

exports.getAllApplications = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [applications, total] = await Promise.all([
    StartupApplication.find(filter)
      .populate('selectedKit', 'title')
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    StartupApplication.countDocuments(filter)
  ]);
  res.json(new ApiResponse(200, { applications, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'All applications'));
});

exports.updateApplication = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const update = {};
  if (status) update.status = status;
  if (adminNotes !== undefined) update.adminNotes = adminNotes;
  const app = await StartupApplication.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!app) throw new ApiError(404, 'Application not found');
  res.json(new ApiResponse(200, app, 'Application updated'));
});
