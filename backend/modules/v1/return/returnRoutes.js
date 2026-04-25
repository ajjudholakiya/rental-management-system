const express = require('express');
const router = express.Router();

const returnController = require('../return/returnControllers');
const { authenticate } = require('../../../middleware/authMiddleware');
const { customerOnly } = require('../../../middleware/roleMiddleware');

// Create return (close rental)
router.post(
  '/create-return/:rentalOrderId',
  authenticate,
  customerOnly,
  returnController.create
);

// Get return details
router.get(
  '/get-return/:rentalOrderId',
  authenticate,
  customerOnly,
  returnController.getByRentalOrder
);

module.exports = router;
