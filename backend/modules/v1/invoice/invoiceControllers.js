const { Invoice, RentalOrder } = require('../../../database/models');

// Create
const create = async (req, res) => {
  try {
    const rentalOrder = await RentalOrder.findOne({
      where: { id: req.params.rentalOrderId, customerId: req.user.id }
    });

    if (!rentalOrder) {
      return res.status(404).json({ error: 'Rental order not found' });
    }

    const existingInvoice = await Invoice.findOne({
      where: { rentalOrderId: req.params.rentalOrderId }
    });

    if (existingInvoice) {
      return res.status(400).json({
        error: 'Invoice already exists for this rental order'
      });
    }

    const invoice = await Invoice.create({
      rentalOrderId: req.params.rentalOrderId,
      invoiceNumber: `INV-${Date.now()}`,
      totalAmount: rentalOrder.totalAmount,
      paidAmount: 0,
      status: 'unpaid'
    });

    return res.status(201).json(invoice);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// My Invoices
const myInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: RentalOrder,
          where: { customerId: req.user.id }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(invoices);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get By Id
const getById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: RentalOrder,
          where: { customerId: req.user.id }
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json(invoice);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  myInvoices,
  getById
};
