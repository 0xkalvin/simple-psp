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
  paymentMethod: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['debit_card', 'credit_card'],
    field: 'payment_method',
  },
  cardLastFourNumbers: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: 'card_last_four_numbers',
  },
  cardHolderName: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'card_holder_name',
  },
  cardExpirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'card_expiration_date',
  },
  cardVerificationCode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: 'card_verification_code',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updated_at',
  },
};

const options = {
  timestamps: true,
  freezeTableName: true,
  tableName: 'transactions',
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
      name: 'transactionId',
    },
    as: 'payables',
  });
};

module.exports = {
  create,
  associate,
};
