"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex("payables", ["payment_date"], {
      concurrently: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex("payables", ["payment_date"], {
      concurrently: true,
    });
  },
};
