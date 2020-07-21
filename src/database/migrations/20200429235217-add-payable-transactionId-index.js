module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addIndex('payables', ['transaction_id'], {
    concurrently: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeIndex('payables', ['transaction_id'], {
    concurrently: true,
  }),
};
