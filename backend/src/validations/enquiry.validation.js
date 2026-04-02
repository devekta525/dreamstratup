const { body } = require('express-validator');

exports.enquiryValidation = [
  body('type').isIn(['bulk_order', 'startup', 'general']).withMessage('Invalid enquiry type'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
];
