const { DataTypes } = require('sequelize');

const attributes = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['paid', 'waiting_funds'],
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fee: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  amount: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
};

const options = {
  indexes: [
    { fields: ['status'] },
    { fields: ['transaction_id'] },
    { fields: ['payment_date'] },
  ],
  tableName: 'Payables',
  freezeTableName: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const create = (connection) => connection.define('Payable', attributes, options);

const associate = (instance, models) => {
  const { Transaction } = models;

  return instance.belongsTo(Transaction, {
    foreignKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'transaction_id',
      name: 'transaction_id',
    },
  });
};

module.exports = {
  create,
  associate,
};
