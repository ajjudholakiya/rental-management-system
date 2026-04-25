module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    rentalOrderId: DataTypes.INTEGER,
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    totalAmount: DataTypes.DECIMAL,
    paidAmount: DataTypes.DECIMAL,
    status: DataTypes.STRING
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.RentalOrder, {
      foreignKey: 'rentalOrderId'
    });

    Invoice.hasMany(models.Payment, {
      foreignKey: 'invoiceId'
    });
  };

  return Invoice;
};
