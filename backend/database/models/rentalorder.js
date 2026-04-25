module.exports = (sequelize, DataTypes) => {
  const RentalOrder = sequelize.define('RentalOrder', {
    quotationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'confirmed'
      // confirmed | ongoing | completed | cancelled
    }
  });

  RentalOrder.associate = (models) => {
    RentalOrder.belongsTo(models.Quotation, {
      foreignKey: 'quotationId'
    });

    RentalOrder.belongsTo(models.User, {
      foreignKey: 'customerId',
      as: 'customer'
    });

    RentalOrder.hasMany(models.Reservation, {
      foreignKey: 'rentalOrderId'
    });

    RentalOrder.hasOne(models.Invoice, {
      foreignKey: 'rentalOrderId'
    });

    RentalOrder.hasOne(models.Return, {
      foreignKey: 'rentalOrderId'
    });
  };

  return RentalOrder;
};
