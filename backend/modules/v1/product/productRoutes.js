const express = require('express');
const router = express.Router();

const productController = require('../product/productControllers');
const { authenticate } = require('../../../middleware/authMiddleware');
const { vendorOnly } = require('../../../middleware/roleMiddleware');

router.post(
  '/create-product',
  authenticate,
  vendorOnly,
  productController.create
);
router.get('/fetch-products', productController.list);
router.get('/fetch-single-product/:id', productController.getById);
router.put(
  '/update-product/:id',
  authenticate,
  vendorOnly,
  productController.update
);
router.delete(
  '/remove-product/:id',
  authenticate,
  vendorOnly,
  productController.remove
);
router.post(
  '/set-product-price/:id/pricing',
  authenticate,
  vendorOnly,
  productController.pricing
);
router.get(
  '/vendor-products',
  authenticate,
  vendorOnly,
  productController.getVendorProducts
);

module.exports = router;
