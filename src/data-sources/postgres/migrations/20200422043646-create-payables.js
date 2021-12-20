const tableName = 'Payables';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(tableName, {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    transaction_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    customer_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM,
      allowNull: false,
      values: ['paid', 'waiting_funds'],
    },
    payment_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    fee: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    amount: {
      type: Sequelize.BIGINT,
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
