'use strict';


module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('transactions', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    amount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    payment_method: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ["debit_card", "credit_card"],
    },
    card_last_four_numbers: {
      type: Sequelize.STRING(4),
      allowNull: false,
    },
    card_holder_name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    card_expiration_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    card_verification_code: {
      type: Sequelize.STRING(4),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('transactions'),
};
