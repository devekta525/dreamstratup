const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, 'Email already registered');

  const user = await User.create({ name, email, phone, password, role: role || 'customer' });
  const token = user.generateToken();

  res.status(201).json(new ApiResponse(201, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Registration successful'));
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');

  const token = user.generateToken();
  res.json(new ApiResponse(200, { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful'));
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(new ApiResponse(200, user, 'User profile'));
});

// PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, city, state, pincode } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, phone, address, city, state, pincode }, { new: true, runValidators: true });
  res.json(new ApiResponse(200, user, 'Profile updated'));
});
