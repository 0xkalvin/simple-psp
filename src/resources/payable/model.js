const { DataTypes } = require('sequelize');

const attributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ['paid', 'waiting_funds'],
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fee: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  receivable_amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
};

const options = {
  indexes: [
    { fields: ['status'] },
    { fields: ['transaction_id'] },
    { fields: ['payment_date'] },
  ],
  tableName: 'payables',
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
      type: DataTypes.UUID,
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
