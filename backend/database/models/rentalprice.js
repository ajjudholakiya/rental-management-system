module.exports = (sequelize, DataTypes) => {
  const RentalPrice = sequelize.define(
    'RentalPrice',
    {
      productId: DataTypes.INTEGER,
      pricePerHour: DataTypes.DECIMAL,
      pricePerDay: DataTypes.DECIMAL,
      pricePerWeek: DataTypes.DECIMAL
    },
    {
      tableName: 'rental_prices',
      freezeTableName: true,
      timestamps: true
    }
  );

  RentalPrice.associate = (models) => {
    RentalPrice.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return RentalPrice;
};
