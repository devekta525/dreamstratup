const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/admin.controller');
const { getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { getAllApplications, updateApplication } = require('../controllers/startupApplication.controller');
const { getAllProviders, approveProvider } = require('../controllers/provider.controller');
const { createJob, getAllJobs } = require('../controllers/job.controller');
const { getAllEnquiries, updateEnquiry } = require('../controllers/enquiry.controller');
const { getCommissions, createCommission, updateCommission } = require('../controllers/commission.controller');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/startup-applications', getAllApplications);
router.put('/startup-applications/:id', updateApplication);

router.get('/providers', getAllProviders);
router.put('/providers/:id/approve', approveProvider);

router.post('/jobs', createJob);
router.get('/jobs', getAllJobs);

router.get('/enquiries', getAllEnquiries);
router.put('/enquiries/:id', updateEnquiry);

router.get('/commissions', getCommissions);
router.post('/commissions', createCommission);
router.put('/commissions/:id', updateCommission);

module.exports = router;
