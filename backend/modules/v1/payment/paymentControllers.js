const { Payment, Invoice } = require('../../../database/models');

// Create
const create = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    const invoice = await Invoice.findByPk(req.params.invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'Invoice already fully paid' });
    }

    const payment = await Payment.create({
      invoiceId: req.params.invoiceId,
      amount,
      paymentMethod,
      status: 'success'
    });

    const updatedPaidAmount = Number(invoice.paidAmount) + Number(amount);

    invoice.paidAmount = updatedPaidAmount;

    if (updatedPaidAmount >= invoice.totalAmount) {
      invoice.status = 'paid';
    } else {
      invoice.status = 'partially_paid';
    }

    await invoice.save();

    return res.status(201).json(payment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get By Invoice
const getByInvoice = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { invoiceId: req.params.invoiceId },
      order: [['createdAt', 'ASC']]
    });

    return res.json(payments);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  getByInvoice
};
