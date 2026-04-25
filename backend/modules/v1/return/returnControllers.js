const {
  Return,
  RentalOrder,
  Reservation
} = require('../../../database/models');

// Create
const create = async (req, res) => {
  try {
    const { lateFee = 0 } = req.body;

    const rentalOrder = await RentalOrder.findOne({
      where: { id: req.params.rentalOrderId, customerId: req.user.id }
    });

    if (!rentalOrder) {
      return res.status(404).json({ error: 'Rental order not found' });
    }

    if (rentalOrder.status === 'completed') {
      return res.status(400).json({
        error: 'Rental order already completed'
      });
    }

    const existingReturn = await Return.findOne({
      where: { rentalOrderId: req.params.rentalOrderId }
    });

    if (existingReturn) {
      return res.status(400).json({
        error: 'Return already exists for this rental order'
      });
    }

    const returnRecord = await Return.create({
      rentalOrderId: req.params.rentalOrderId,
      returnDate: new Date(),
      lateFee
    });

    rentalOrder.status = 'completed';
    await rentalOrder.save();

    await Reservation.destroy({
      where: { rentalOrderId: req.params.rentalOrderId }
    });

    return res.status(201).json(returnRecord);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get By Rental Order
const getByRentalOrder = async (req, res) => {
  try {
    const returnRecord = await Return.findOne({
      where: { rentalOrderId: req.params.rentalOrderId }
    });

    if (!returnRecord) {
      return res.status(404).json({
        error: 'Return record not found'
      });
    }

    return res.json(returnRecord);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  getByRentalOrder
};
