const tableName = 'Payables';

module.exports = {
  up: (queryInterface) => queryInterface.addIndex(tableName, ['payment_date'], {
    concurrently: true,
  }),

  down: (queryInterface) => queryInterface.removeIndex(tableName, ['payment_date'], {
    concurrently: true,
  }),
};
