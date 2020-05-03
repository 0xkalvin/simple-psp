const { DataTypes } = require("sequelize");
const payableQueue = require('../payable/queue');

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
    values: ["debit_card", "credit_card"],
    field: "payment_method",
  },
  cardLastFourNumbers: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "card_last_four_numbers",
  },
  cardHolderName: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: "card_holder_name",
  },
  cardExpirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "card_expiration_date",
  },
  cardVerificationCode: {
    type: DataTypes.STRING(4),
    allowNull: false,
    field: "card_verification_code",
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

const hooks = {
  afterCreate: async (transactionInstance) => {
    const payablesRules = {
      credit: {
        status: "waiting_funds",
        fee: 5,
        daysUntilPayment: 30,
      },
      debit: {
        status: "paid",
        fee: 3,
        daysUntilPayment: 0,
      },
    };
    const { Payable } = transactionInstance.sequelize.models;

    const discountFee = (amount, fee) => ((100 - fee) * amount) / 100;

    const setPaymentDate = (transactionDate, daysUntilPayment) => {
      const createdAtAsDate = new Date(transactionDate);
      return createdAtAsDate.setDate(
        createdAtAsDate.getDate() + daysUntilPayment
      );
    };

    const isCredit = transactionInstance.paymentMethod === "credit_card";

    const { status, fee, daysUntilPayment } = isCredit
      ? payablesRules.credit
      : payablesRules.debit;

    const payablePayload = {
      fee,
      status,
      transactionId: transactionInstance.id,
      receivableAmount: discountFee(transactionInstance.amount, fee),
      paymentDate: setPaymentDate(
        transactionInstance.createdAt,
        daysUntilPayment
      ),
    };

    const payable = await Payable.create(payablePayload);

    payableQueue.push(payable);

    return payable;
  },
};

const options = {
  timestamps: true,
  freezeTableName: true,
  tableName: "transactions",
  hooks,
};

const create = (connection) =>
  connection.define("Transaction", attributes, options);

const associate = (instance, models) => {
  const { Payable } = models;

  return instance.hasMany(Payable, {
    foreignKey: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "transaction_id",
      name: "transactionId",
    },
    as: "payables",
  });
};

module.exports = {
  create,
  associate,
};
