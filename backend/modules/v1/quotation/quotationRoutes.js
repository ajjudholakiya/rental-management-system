const express = require('express');
const router = express.Router();

const quotationController = require('../quotation/quotationControllers');
const { authenticate } = require('../../../middleware/authMiddleware');
const { customerOnly } = require('../../../middleware/roleMiddleware');

router.post(
  '/create-quotation',
  authenticate,
  customerOnly,
  quotationController.create
);

router.post(
  '/add-product-to-quotation/:id/items',
  authenticate,
  customerOnly,
  quotationController.addItem
);

router.put(
  '/update-product-in-quotation/:id/items/:itemId',
  authenticate,
  customerOnly,
  quotationController.updateItem
);

router.get(
  '/get-single-quotation/:id',
  authenticate,
  customerOnly,
  quotationController.getById
);

router.get(
  '/get-my-quotations',
  authenticate,
  customerOnly,
  quotationController.myQuotations
);

module.exports = router;
