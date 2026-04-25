module.exports = (sequelize, DataTypes) => {
  const QuotationItem = sequelize.define('QuotationItem', {
    quotationId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    price: DataTypes.DECIMAL,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  });

  QuotationItem.associate = (models) => {
    QuotationItem.belongsTo(models.Quotation, {
      foreignKey: 'quotationId'
    });

    QuotationItem.belongsTo(models.Product, {
      foreignKey: 'productId'
    });
  };

  return QuotationItem;
};
