'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('payables', ['transaction_id'], {
      concurrently: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('payables', ['transaction_id'], {
      concurrently: true,
    });
  },
};
