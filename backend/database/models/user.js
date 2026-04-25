module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      companyName: DataTypes.STRING,
      gstin: DataTypes.STRING,
      resetPasswordOtp: { type: DataTypes.STRING, allowNull: true },
      resetPasswordOtpExpires: { type: DataTypes.DATE, allowNull: true }
    },
    {
      tableName: 'users',
      freezeTableName: true,
      timestamps: true
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Product, {
      foreignKey: 'ownerVendorId',
      as: 'products'
    });
    User.hasMany(models.Quotation, {
      foreignKey: 'customerId',
      as: 'quotations'
    });
    User.hasMany(models.RentalOrder, {
      foreignKey: 'customerId',
      as: 'rentalOrders'
    });
  };

  return User;
};
