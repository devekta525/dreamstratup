const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { productValidation } = require('../validations/product.validation');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('admin'), upload.array('images', 5), productValidation, validate, createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
