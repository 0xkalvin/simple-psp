'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('payables', ['status'], {
      concurrently: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('payables', ['status'], {
      concurrently: true,
    });
  },
};
