
const { DataTypes } = require('sequelize');

const attributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  transactionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "transaction_id",
  },
  status: {
    type: DataTypes.ENUM,
    allowNull: false,
    values: ["paid", "waiting_funds"],
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "payment_date",
  },
  fee: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  receivableAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    field: "receivable_amount",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "created_at",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "updated_at",
  },
};

const options = {
  indexes: [
    { fields: ["status"] }, 
    { fields: ["transaction_id"] },
    { fields: ["payment_date"] },
  ],
  timestamps: true,
  freezeTableName: true,
  tableName: "payables",
};


const create = connection => connection.define("Payable", attributes, options);


module.exports = {
  create,
};
