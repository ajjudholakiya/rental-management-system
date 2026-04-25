module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    productId: DataTypes.INTEGER,
    rentalOrderId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  });

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Product, {
      foreignKey: 'productId'
    });

    Reservation.belongsTo(models.RentalOrder, {
      foreignKey: 'rentalOrderId'
    });
  };

  return Reservation;
};
