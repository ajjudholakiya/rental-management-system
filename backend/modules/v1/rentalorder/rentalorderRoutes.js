const express = require('express');
const router = express.Router();

const rentalOrderController = require('../rentalorder/rentalOrderControllers');
const { authenticate } = require('../../../middleware/authMiddleware');
const { customerOnly } = require('../../../middleware/roleMiddleware');

// Confirm quotation → create rental order
router.post(
  '/confirm-quotation/:quotationId',
  authenticate,
  customerOnly,
  rentalOrderController.confirm
);

// Get all rental orders of customer
router.get(
  '/get-my-rental-orders',
  authenticate,
  customerOnly,
  rentalOrderController.myOrders
);

// Get single rental order
router.get(
  '/get-single-rental-order/:id',
  authenticate,
  customerOnly,
  rentalOrderController.getById
);

module.exports = router;
