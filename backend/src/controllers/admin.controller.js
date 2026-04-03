const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const StartupApplication = require('../models/StartupApplication.model');
const ServiceProviderProfile = require('../models/ServiceProviderProfile.model');
const Enquiry = require('../models/Enquiry.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/admin/users
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role && role !== 'all') filter.role = role;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  res.json(new ApiResponse(200, { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'Users fetched'));
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalStartupApplications,
    totalProviders,
    pendingEnquiries,
    revenueResult
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    StartupApplication.countDocuments(),
    ServiceProviderProfile.countDocuments(),
    Enquiry.countDocuments({ isResolved: false }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  res.json(new ApiResponse(200, {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    totalStartupApplications,
    totalProviders,
    pendingEnquiries
  }, 'Dashboard stats'));
});
