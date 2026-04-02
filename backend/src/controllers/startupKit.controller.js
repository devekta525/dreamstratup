const StartupKit = require('../models/StartupKit.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.getStartupKits = asyncHandler(async (req, res) => {
  const kits = await StartupKit.find({ isActive: true });
  res.json(new ApiResponse(200, kits, 'Startup kits'));
});

exports.getStartupKit = asyncHandler(async (req, res) => {
  const kit = await StartupKit.findById(req.params.id);
  if (!kit) throw new ApiError(404, 'Startup kit not found');
  res.json(new ApiResponse(200, kit, 'Startup kit details'));
});

exports.createStartupKit = asyncHandler(async (req, res) => {
  if (req.file) req.body.image = `/uploads/${req.file.filename}`;
  const kit = await StartupKit.create(req.body);
  res.status(201).json(new ApiResponse(201, kit, 'Startup kit created'));
});

exports.updateStartupKit = asyncHandler(async (req, res) => {
  if (req.file) req.body.image = `/uploads/${req.file.filename}`;
  const kit = await StartupKit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!kit) throw new ApiError(404, 'Startup kit not found');
  res.json(new ApiResponse(200, kit, 'Startup kit updated'));
});

exports.deleteStartupKit = asyncHandler(async (req, res) => {
  const kit = await StartupKit.findByIdAndDelete(req.params.id);
  if (!kit) throw new ApiError(404, 'Startup kit not found');
  res.json(new ApiResponse(200, null, 'Startup kit deleted'));
});
