const tableName = 'Payables';

module.exports = {
  up: (queryInterface) => queryInterface.addIndex(tableName, ['transaction_id'], {
    concurrently: true,
  }),

  down: (queryInterface) => queryInterface.removeIndex(tableName, ['transaction_id'], {
    concurrently: true,
  }),
};
