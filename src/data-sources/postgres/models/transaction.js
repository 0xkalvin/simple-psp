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
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['debit_card', 'credit_card'],
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['pending_payment', 'paid', 'pending_refund', 'refunded'],
  },
  card_last_four_numbers: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
  card_holder_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  card_expiration_date: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'card_expiration_date',
  },
  card_verification_code: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
};

const options = {
  tableName: 'Transactions',
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const create = (connection) => connection.define('Transaction', attributes, options);

const associate = (instance, models) => {
  const { Payable } = models;

  return instance.hasMany(Payable, {
    foreignKey: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'transaction_id',
      name: 'transaction_id',
    },
    as: 'Payables',
  });
};

module.exports = {
  create,
  associate,
};
