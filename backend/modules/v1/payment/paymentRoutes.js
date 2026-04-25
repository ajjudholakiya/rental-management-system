const express = require('express');
const router = express.Router();

const paymentController = require('../payment/paymentControllers');
const { authenticate } = require('../../../middleware/authMiddleware');
const { customerOnly } = require('../../../middleware/roleMiddleware');

// Pay invoice
router.post(
  '/pay-invoice/:invoiceId',
  authenticate,
  customerOnly,
  paymentController.create
);

// Get invoice payments
router.get(
  '/get-invoice-payments/:invoiceId',
  authenticate,
  customerOnly,
  paymentController.getByInvoice
);

module.exports = router;
