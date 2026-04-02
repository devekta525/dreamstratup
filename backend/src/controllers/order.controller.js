const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'title images');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;
  const items = cart.items.map(item => ({
    product: item.product._id,
    title: item.product.title,
    quantity: item.quantity,
    price: item.price,
    image: item.product.images?.[0] || ''
  }));

  const order = await Order.create({
    user: req.user.id,
    items,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod: paymentMethod || 'cash',
    totalAmount: cart.totalAmount,
    notes
  });

  await Cart.findOneAndDelete({ user: req.user.id });
  res.status(201).json(new ApiResponse(201, order, 'Order placed successfully'));
});

// GET /api/orders/my
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
  res.json(new ApiResponse(200, orders, 'My orders'));
});

// GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }
  res.json(new ApiResponse(200, order, 'Order details'));
});

// GET /api/admin/orders
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email phone').sort('-createdAt').skip(skip).limit(Number(limit)),
    Order.countDocuments(filter)
  ]);
  res.json(new ApiResponse(200, { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'All orders'));
});

// PUT /api/admin/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus, notes } = req.body;
  const update = {};
  if (orderStatus) update.orderStatus = orderStatus;
  if (paymentStatus) update.paymentStatus = paymentStatus;
  if (notes) update.notes = notes;
  const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(new ApiResponse(200, order, 'Order status updated'));
});
