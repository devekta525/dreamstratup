const { body } = require('express-validator');

exports.productValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Furniture Hardware', 'Sanitary', 'Electrical', 'Home Decor']).withMessage('Invalid category'),
  body('wholesalePrice').isNumeric().withMessage('Wholesale price must be a number'),
  body('moq').optional().isInt({ min: 1 }).withMessage('MOQ must be at least 1'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative')
];
