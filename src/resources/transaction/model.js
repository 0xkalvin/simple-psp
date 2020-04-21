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
      cardNumber: {
        type: dataTypes.STRING(4),
        allowNull: false,
        field: "card_number",
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
        type: dataTypes.STRING(3),
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

const associate = () => {};

module.exports = {
  create,
};
