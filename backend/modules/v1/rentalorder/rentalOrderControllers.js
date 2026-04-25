const {
  Quotation,
  RentalOrder,
  Reservation,
  Product
} = require('../../../database/models');

const { Op } = require('sequelize');

// Internal: Check Availability
const checkAvailabilityInternal = async (productId, startDate, endDate) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

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

// Confirm
const confirm = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      where: { id: req.params.quotationId, customerId: req.user.id },
      include: ['items']
    });

    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    if (quotation.status !== 'draft') {
      return res.status(400).json({ error: 'Quotation already confirmed' });
    }

    if (!quotation.items || quotation.items.length === 0) {
      return res.status(400).json({ error: 'Quotation has no items' });
    }

    // Check availability again
    for (const item of quotation.items) {
      const available = await checkAvailabilityInternal(
        item.productId,
        item.startDate,
        item.endDate
      );

      if (!available) {
        return res.status(400).json({
          error: `Product ${item.productId} is no longer available`
        });
      }
    }

    const totalAmount = quotation.items.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );

    const rentalOrder = await RentalOrder.create({
      quotationId: quotation.id,
      customerId: req.user.id,
      totalAmount,
      status: 'confirmed'
    });

    // Create reservations
    for (const item of quotation.items) {
      await Reservation.create({
        productId: item.productId,
        startDate: item.startDate,
        endDate: item.endDate,
        rentalOrderId: rentalOrder.id
      });
    }

    quotation.status = 'confirmed';
    await quotation.save();

    return res.status(201).json(rentalOrder);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// My Orders
const myOrders = async (req, res) => {
  try {
    const orders = await RentalOrder.findAll({
      where: { customerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    return res.json(orders);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get By Id
const getById = async (req, res) => {
  try {
    const order = await RentalOrder.findOne({
      where: { id: req.params.id, customerId: req.user.id }
    });

    if (!order) {
      return res.status(404).json({ error: 'Rental order not found' });
    }

    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  confirm,
  myOrders,
  getById
};
