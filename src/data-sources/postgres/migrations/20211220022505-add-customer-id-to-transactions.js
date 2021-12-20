const tableName = 'Transactions';

module.exports = {
  up: (queryInterface) => queryInterface.addIndex(tableName, ['customer_id'], {
    concurrently: true,
  }),

  down: (queryInterface) => queryInterface.removeIndex(tableName, ['customer_id'], {
    concurrently: true,
  }),
};
