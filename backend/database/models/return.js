module.exports = (sequelize, DataTypes) => {
  const Return = sequelize.define('Return', {
    rentalOrderId: DataTypes.INTEGER,
    returnDate: DataTypes.DATE,
    lateFee: DataTypes.DECIMAL
  });

  Return.associate = (models) => {
    Return.belongsTo(models.RentalOrder, {
      foreignKey: 'rentalOrderId'
    });
  };

  return Return;
};
