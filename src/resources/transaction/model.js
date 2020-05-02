const { DataTypes } = require('sequelize');

const create = (connection, dataTypes) => {
  return connection.define(
    "Transaction",
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: dataTypes.DOUBLE,
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      paymentMethod: {
        type: dataTypes.ENUM,
        allowNull: false,
        values: ["debit_card", "credit_card"],
        field: "payment_method",
      },
      cardLastFourNumbers: {
        type: dataTypes.STRING(4),
        allowNull: false,
        field: "card_last_four_numbers",
      },
      cardHolderName: {
        type: dataTypes.TEXT,
        allowNull: false,
        field: "card_holder_name",
      },
      cardExpirationDate: {
        type: dataTypes.DATE,
        allowNull: false,
        field: "card_expiration_date",
      },
      cardVerificationCode: {
        type: dataTypes.STRING(4),
        allowNull: false,
        field: "card_verification_code",
      },
      createdAt: {
        type: dataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
      tableName: 'transactions',
    }
  );
};

const associate = (instance, models) => {
  
  const { Payable } = models;
  
  return instance.hasMany(Payable, { foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'transaction_id',
    name: 'transactionId',
  }});
};

module.exports = {
  create,
  associate,
};
