const {
  Quotation,
  QuotationItem,
  RentalPrice,
  Reservation,
  Product,
  sequelize
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

// Create
const create = async (req, res) => {
  try {
    const quotation = await Quotation.create({
      customerId: req.user.id,
      status: 'draft',
      notes: req.body.notes
    });

    return res.status(201).json(quotation);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Add Item
const addItem = async (req, res) => {
  try {
    const { productId, startDate, endDate, quantity = 1 } = req.body;

    if (!productId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'productId, startDate, endDate are required'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        error: 'Quantity must be greater than zero'
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        error: 'End date must be after start date'
      });
    }

    const result = await sequelize.transaction(async (t) => {
      const quotation = await Quotation.findByPk(req.params.id, {
        transaction: t
      });

      if (!quotation) throw new Error('Quotation not found');

      if (quotation.status !== 'draft') {
        throw new Error('Quotation already confirmed');
      }

      const isAvailable = await checkAvailabilityInternal(
        productId,
        startDate,
        endDate
      );

      if (!isAvailable) {
        throw new Error('Product not available for selected dates');
      }

      const pricing = await RentalPrice.findOne({
        where: { productId },
        transaction: t
      });

      if (!pricing || !pricing.pricePerDay) {
        throw new Error('Rental price not found');
      }

      const days =
        Math.ceil(
          (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        ) || 1;

      const existingItem = await QuotationItem.findOne({
        where: { quotationId: req.params.id, productId },
        transaction: t
      });

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.startDate = startDate;
        existingItem.endDate = endDate;
        existingItem.price = pricing.pricePerDay * existingItem.quantity * days;

        await existingItem.save({ transaction: t });
        return existingItem;
      }

      const price = pricing.pricePerDay * quantity * days;

      return QuotationItem.create(
        {
          quotationId: req.params.id,
          productId,
          startDate,
          endDate,
          quantity,
          price
        },
        { transaction: t }
      );
    });

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get By Id
const getById = async (req, res) => {
  try {
    const quotation = await Quotation.findOne({
      where: { id: req.params.id, customerId: req.user.id },
      include: [{ association: 'items' }]
    });

    if (!quotation) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    return res.json(quotation);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// My Quotations
const myQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      where: { customerId: req.user.id },
      include: [{ association: 'items' }],
      order: [['createdAt', 'DESC']]
    });

    return res.json(quotations);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Update Item
const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id, itemId } = req.params;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: 'Quantity must be greater than zero' });
    }

    const result = await sequelize.transaction(async (t) => {
      const quotation = await Quotation.findByPk(id, { transaction: t });
      if (!quotation) throw new Error('Quotation not found');
      if (quotation.status !== 'draft') {
        throw new Error('Quotation already confirmed');
      }

      const existingItem = await QuotationItem.findOne({
        where: { id: itemId, quotationId: id },
        transaction: t
      });

      if (!existingItem) {
        throw new Error('Quotation item not found');
      }

      const pricing = await RentalPrice.findOne({
        where: { productId: existingItem.productId },
        transaction: t
      });

      if (!pricing || !pricing.pricePerDay) {
        throw new Error('Rental price not found');
      }

      const days =
        Math.ceil(
          (new Date(existingItem.endDate) - new Date(existingItem.startDate)) /
            (1000 * 60 * 60 * 24)
        ) || 1;

      existingItem.quantity = quantity;
      existingItem.price = pricing.pricePerDay * quantity * days;

      await existingItem.save({ transaction: t });
      return existingItem;
    });

    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  addItem,
  updateItem,
  getById,
  myQuotations
};
