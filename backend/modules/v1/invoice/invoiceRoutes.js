const express = require('express');
const router = express.Router();

const invoiceController = require('../invoice/invoiceControllers');
const { authenticate } = require('../../../middleware/authMiddleware');
const { customerOnly } = require('../../../middleware/roleMiddleware');

// Create invoice from rental order
router.post(
  '/create-invoice/:rentalOrderId',
  authenticate,
  customerOnly,
  invoiceController.create
);

// Get all invoices
router.get(
  '/get-my-invoices',
  authenticate,
  customerOnly,
  invoiceController.myInvoices
);

// Get single invoice
router.get(
  '/get-single-invoice/:id',
  authenticate,
  customerOnly,
  invoiceController.getById
);

module.exports = router;
