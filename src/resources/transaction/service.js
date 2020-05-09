const database = require("../../database");
const payableService = require("../payable/service");
const payableQueue = require('../payable/queue');
const { Transaction, Payable } = database.models;

const createTransaction = async payload => {
  const addCardLastFourNumbers = payload => ({
    ...payload,
    cardLastFourNumbers: payload.cardNumber.substr(-4),
  });

  const transactionPayload = addCardLastFourNumbers(payload);

  return await database.transaction(async t => {
    const createdTransaction = await Transaction.create(
      transactionPayload,
      { transaction: t }
    );

    const payablePayload = payableService.buildPayable(createdTransaction);

    const createdPayable = await Payable.create(payablePayload, { transaction: t });
    
    payableQueue.push(createdPayable);
    
    return createdTransaction;
  })
};

const showTransaction = async (transactionId) => {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionId,
    },
    include: [
      {
        model: Payable,
        as: "payables",
        attributes: ["id", "status", "paymentDate", "fee", "receivableAmount"],
      },
    ],
  });

  return transaction;
};

const getAllTransactions = async () => {
  return await Transaction.findAll();
};

module.exports = {
  createTransaction,
  showTransaction,
  getAllTransactions,
};
