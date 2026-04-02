const User = require('../models/User.model');
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const StartupApplication = require('../models/StartupApplication.model');
const ServiceProviderProfile = require('../models/ServiceProviderProfile.model');
const Enquiry = require('../models/Enquiry.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');

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
