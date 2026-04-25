require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./database/models');

const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const authRoutes = require('./modules/v1/auth/authRoutes');
const productRoutes = require('./modules/v1/product/productRoutes');
const reservationRoutes = require('./modules/v1/reservations/reservationRoutes');
const quotationRoutes = require('./modules/v1/quotation/quotationRoutes');
const rentalOrderRoutes = require('./modules/v1/rentalorder/rentalorderRoutes');
const invoiceRoutes = require('./modules/v1/invoice/invoiceRoutes');
const paymentRoutes = require('./modules/v1/payment/paymentRoutes');
const returnRoutes = require('./modules/v1/return/returnRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/quotations', quotationRoutes);
app.use('/api/v1/rental-orders', rentalOrderRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/returns', returnRoutes);

// Database connection
db.sequelize
  .authenticate()
  .then(() => console.log('Database Connected...'))
  .catch((err) => console.error('Connection Failed..', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
