"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("payables", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ["paid", "waiting_funds"],
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fee: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      receivable_amount: {
        type: Sequelize.DOUBLE,
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

  down: (queryInterface, Sequelize) => queryInterface.dropTable("payables"),
};
