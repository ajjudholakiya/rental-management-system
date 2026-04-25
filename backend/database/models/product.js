module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      quantity: DataTypes.INTEGER,
      rentable: DataTypes.BOOLEAN,
      status: DataTypes.STRING,
      ownerVendorId: DataTypes.INTEGER
    },
    {
      tableName: 'products', // ✅ match your DB table
      freezeTableName: true, // ✅ prevent Sequelize pluralization
      timestamps: true // keep if your table has createdAt/updatedAt
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      foreignKey: 'ownerVendorId',
      as: 'vendor'
    });

    Product.hasOne(models.RentalPrice, {
      foreignKey: 'productId',
      as: 'pricing'
    });

    Product.hasMany(models.QuotationItem, {
      foreignKey: 'productId'
    });

    Product.hasMany(models.Reservation, {
      foreignKey: 'productId'
    });
  };

  return Product;
};
