const { body } = require('express-validator');

exports.productValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['Furniture Hardware', 'Sanitary', 'Electrical', 'Home Decor']).withMessage('Invalid category'),
  body('minPrice').isNumeric().withMessage('Minimum price must be a number'),
  body('maxPrice').isNumeric().withMessage('Maximum price must be a number'),
  body('moq').optional().isInt({ min: 5 }).withMessage('MOQ must be at least 5'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative')
];
