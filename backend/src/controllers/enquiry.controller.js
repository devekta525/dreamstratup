const Enquiry = require('../models/Enquiry.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.submitEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);
  res.status(201).json(new ApiResponse(201, enquiry, 'Enquiry submitted'));
});

exports.getAllEnquiries = asyncHandler(async (req, res) => {
  const { type, resolved, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (resolved !== undefined) filter.isResolved = resolved === 'true';
  const skip = (Number(page) - 1) * Number(limit);
  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('product', 'title')
      .populate('startupKit', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Enquiry.countDocuments(filter)
  ]);
  res.json(new ApiResponse(200, { enquiries, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'Enquiries'));
});

exports.updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { isResolved: req.body.isResolved }, { new: true });
  if (!enquiry) throw new ApiError(404, 'Enquiry not found');
  res.json(new ApiResponse(200, enquiry, 'Enquiry updated'));
});
