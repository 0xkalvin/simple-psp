const tableName = 'Payables';

module.exports = {
  up: (queryInterface) => queryInterface.addIndex(tableName, ['status'], {
    concurrently: true,
  }),

  down: (queryInterface) => queryInterface.removeIndex(tableName, ['status'], {
    concurrently: true,
  }),
};
