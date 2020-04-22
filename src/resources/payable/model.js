const create = (connection, dataTypes) => {
    return connection.define(
      "Payable",
      {
        id: {
          type: dataTypes.UUID,
          defaultValue: dataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        transactionId: {
            type: types.UUID,
            allowNull: false,
            field: "transaction_id",
        },
        status: {
            type: types.ENUM,
            allowNull: false,
            values: ['paid', 'waiting_funds'],
        },
        paymentDate: {
            type: types.DATE,
            allowNull: false,
            field: "payment_date",
        },
        fee: {
            type: types.DOUBLE,
            allowNull: false,
        },
        receivableAmount: {
            type: types.DOUBLE,
            allowNull: false,
            field: "receivable_amount",
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
        tableName: 'payables',
      }
    );
  };
  
  const associate = () => {};
  
  module.exports = {
    create,
  };
  