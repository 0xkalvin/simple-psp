const database = require("../../database");
const { Transaction, Payable } = database.models;

const createTransaction = async (transactionPayload) => {
  const getLastFourNumbers = (cardNumber) => cardNumber.substr(-4);

  const transaction = await Transaction.create({
    ...transactionPayload,
    cardLastFourNumbers: getLastFourNumbers(transactionPayload.cardNumber),
  });

  return transaction;
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
        attributes: [ 'id', 'status', 'paymentDate', 'fee', 'receivableAmount']
      },
    ],
  });

  return transaction;
};

module.exports = {
  createTransaction,
  showTransaction,
};
