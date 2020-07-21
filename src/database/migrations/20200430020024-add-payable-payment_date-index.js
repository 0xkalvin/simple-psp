module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addIndex('payables', ['payment_date'], {
    concurrently: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeIndex('payables', ['payment_date'], {
    concurrently: true,
  }),
};
