const express = require('express');
const router = express.Router();

const reservationController = require('../reservations/reservationControllers');
const { authenticate } = require('../../../middleware/authMiddleware');

router.get(
  '/check-reservation-availability',
  reservationController.checkAvailability
);
router.post('/create-reservation', authenticate, reservationController.reserve);
router.get(
  '/view-product-reservation/product/:productId',
  reservationController.listByProduct
);

module.exports = router;
