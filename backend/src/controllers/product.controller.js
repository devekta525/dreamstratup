const Product = require('../models/Product.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, brand, minPrice, maxPrice, search, featured, page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const filter = { isActive: true };
  if (category) filter.category = category;
  if (brand) filter.brand = new RegExp(brand, 'i');
  if (featured === 'true') filter.featured = true;
  if (minPrice || maxPrice) {
    filter.wholesalePrice = {};
    if (minPrice) filter.wholesalePrice.$gte = Number(minPrice);
    if (maxPrice) filter.wholesalePrice.$lte = Number(maxPrice);
  }
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter)
  ]);

  res.json(new ApiResponse(200, { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, 'Products fetched'));
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, product, 'Product details'));
});

// POST /api/products (admin)
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.id;
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(f => `/uploads/${f.filename}`);
  }
  const product = await Product.create(req.body);
  res.status(201).json(new ApiResponse(201, product, 'Product created'));
});

// PUT /api/products/:id (admin)
exports.updateProduct = asyncHandler(async (req, res) => {
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(f => `/uploads/${f.filename}`);
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, product, 'Product updated'));
});

// DELETE /api/products/:id (admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(new ApiResponse(200, null, 'Product deleted'));
});
