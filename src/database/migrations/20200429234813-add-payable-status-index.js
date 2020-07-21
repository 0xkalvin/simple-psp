module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addIndex('payables', ['status'], {
    concurrently: true,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeIndex('payables', ['status'], {
    concurrently: true,
  }),
};
