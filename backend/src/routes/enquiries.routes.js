const express = require('express');
const router = express.Router();
const { submitEnquiry } = require('../controllers/enquiry.controller');
const { enquiryValidation } = require('../validations/enquiry.validation');
const validate = require('../middleware/validate');

router.post('/', enquiryValidation, validate, submitEnquiry);

module.exports = router;
