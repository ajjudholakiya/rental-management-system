module.exports = (sequelize, DataTypes) => {
  const Quotation = sequelize.define('Quotation', {
    customerId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL
  });

  Quotation.associate = (models) => {
    Quotation.belongsTo(models.User, {
      foreignKey: 'customerId',
      as: 'customer'
    });

    Quotation.hasMany(models.QuotationItem, {
      foreignKey: 'quotationId',
      as: 'items'
    });

    Quotation.hasOne(models.RentalOrder, {
      foreignKey: 'quotationId'
    });
  };

  return Quotation;
};
