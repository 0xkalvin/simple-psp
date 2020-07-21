const {DataTypes} = require('sequelize');

const attributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
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
  tableName: 'transactions',
  freezeTableName: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

const create = (connection) =>
  connection.define('Transaction', attributes, options);

const associate = (instance, models) => {
  const {Payable} = models;

  return instance.hasMany(Payable, {
    foreignKey: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'transaction_id',
      name: 'transaction_id',
    },
    as: 'payables',
  });
};

module.exports = {
  create,
  associate,
};
