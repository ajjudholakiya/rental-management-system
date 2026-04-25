'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invoices', 'invoiceNumber', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: 'TEMP'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invoices', 'invoiceNumber');
  }
};
