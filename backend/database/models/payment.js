module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    invoiceId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    paymentMethod: DataTypes.STRING,
    status: DataTypes.STRING
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Invoice, {
      foreignKey: 'invoiceId'
    });
  };

  return Payment;
};
