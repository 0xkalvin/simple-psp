const tableName = 'Transactions';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(tableName, {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    amount: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    payment_method: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['debit_card', 'credit_card'],
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['pending_payment', 'paid', 'pending_refund', 'refunded'],
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

  down: (queryInterface) => queryInterface.dropTable(tableName),
};
