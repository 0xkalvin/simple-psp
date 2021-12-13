const tableName = 'Payables';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addIndex(tableName, ['transaction_id'], {
    concurrently: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeIndex(tableName, ['transaction_id'], {
    concurrently: true,
  }),
};
