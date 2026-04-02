const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/cart
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'title images wholesalePrice moq stock');
  if (!cart) cart = { items: [], totalAmount: 0 };
  res.json(new ApiResponse(200, cart, 'Cart fetched'));
});

// POST /api/cart/add
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  if (quantity < product.moq) throw new ApiError(400, `Minimum order quantity is ${product.moq}`);

  let price = product.wholesalePrice;
  if (product.bulkPricingTiers && product.bulkPricingTiers.length > 0) {
    const tier = product.bulkPricingTiers.find(t => quantity >= t.minQty && (!t.maxQty || quantity <= t.maxQty));
    if (tier) price = tier.price;
  }

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = price;
  } else {
    cart.items.push({ product: productId, quantity, price, moqApplied: quantity >= product.moq });
  }

  cart.calculateTotal();
  await cart.save();
  await cart.populate('items.product', 'title images wholesalePrice moq stock');
  res.json(new ApiResponse(200, cart, 'Cart updated'));
});

// PUT /api/cart/update
exports.updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex === -1) throw new ApiError(404, 'Item not in cart');

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.calculateTotal();
  await cart.save();
  res.json(new ApiResponse(200, cart, 'Cart updated'));
});

// DELETE /api/cart/remove/:productId
exports.removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
  cart.calculateTotal();
  await cart.save();
  res.json(new ApiResponse(200, cart, 'Item removed'));
});

// DELETE /api/cart/clear
exports.clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });
  res.json(new ApiResponse(200, null, 'Cart cleared'));
});
