const tableName = 'Payables';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addIndex(tableName, ['payment_date'], {
    concurrently: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeIndex(tableName, ['payment_date'], {
    concurrently: true,
  }),
};
