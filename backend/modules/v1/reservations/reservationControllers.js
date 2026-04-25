const { Reservation, Product } = require('../../../database/models');
const { Op } = require('sequelize');

const {
  availabilitySchema,
  createReservationSchema
} = require('../../../validations/reservationValidation');

// Internal: Check availability logic
const checkAvailabilityInternal = async (productId, startDate, endDate) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  if (product.status !== 'available' || !product.rentable) {
    return false;
  }

  const overlapping = await Reservation.findOne({
    where: {
      productId,
      [Op.not]: {
        [Op.or]: [
          { endDate: { [Op.lt]: startDate } },
          { startDate: { [Op.gt]: endDate } }
        ]
      }
    }
  });

  return !overlapping;
};

// Check Availability
const checkAvailability = async (req, res) => {
  try {
    const { error, value } = availabilitySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { productId, startDate, endDate } = value;

    const available = await checkAvailabilityInternal(
      productId,
      startDate,
      endDate
    );

    return res.json({ available });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Create Reservation
const reserve = async (req, res) => {
  try {
    const { error, value } = createReservationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { productId, startDate, endDate } = value;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const isAvailable = await checkAvailabilityInternal(
      productId,
      startDate,
      endDate
    );

    if (!isAvailable) {
      return res.status(400).json({
        error: 'Product is not available for selected dates'
      });
    }

    const reservation = await Reservation.create({
      productId,
      startDate,
      endDate
    });

    return res.status(201).json({
      message: 'Reservation Created Successfully',
      reservation
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// List by Product
const listByProduct = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { productId: req.params.productId }
    });

    return res.json(reservations);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  checkAvailability,
  reserve,
  listByProduct
};
