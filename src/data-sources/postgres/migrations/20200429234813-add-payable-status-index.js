const tableName = 'Payables';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addIndex(tableName, ['status'], {
    concurrently: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeIndex(tableName, ['status'], {
    concurrently: true,
  }),
};
