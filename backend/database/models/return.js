module.exports = (sequelize, DataTypes) => {
  const Return = sequelize.define(
    'Return',
    {
      rentalOrderId: DataTypes.INTEGER,
      returnDate: DataTypes.DATE,
      lateFee: DataTypes.DECIMAL
    },
    {
      tableName: 'returns',
      freezeTableName: true,
      timestamps: true
    }
  );

  Return.associate = (models) => {
    Return.belongsTo(models.RentalOrder, { foreignKey: 'rentalOrderId' });
  };

  return Return;
};
