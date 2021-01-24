const database = require('../../database');
const payableService = require('../payable/service');
const payableQueue = require('../payable/queue');
const logger = require('../../lib/logger');

const { Transaction, Payable } = database.models;

const createTransaction = async (payload) => {
  const addCardLastFourNumbers = (payload) => ({
    ...payload,
    card_last_four_numbers: payload.card_number.substr(-4),
  });

  const transactionPayload = addCardLastFourNumbers(payload);

  const databaseTransaction = await database.transaction();

  try {
    const transaction = await Transaction.create(
      transactionPayload,
      { transaction: databaseTransaction },
    );

    const payablePayload = payableService.buildPayablePayload(transaction);

    await databaseTransaction.commit();

    payableQueue.push(payablePayload);

    logger.info({
      message: 'Successfully created transaction',
      event: 'transaction_creation',
      transaction_id: transaction.id,
    });

    return transaction;
  } catch (error) {
    logger.error({
      message: 'Failed to create transaction',
      event: 'transaction_creation',
      err_message: error.message,
      err_stack: error.stack,
    });

    await databaseTransaction.rollback();

    throw error;
  }
};

const showTransaction = async (transactionId) => {
  const transaction = await Transaction.findOne({
    where: {
      id: transactionId,
    },
    include: [
      {
        model: Payable,
        as: 'payables',
        attributes: ['id', 'status', 'payment_date', 'fee', 'receivable_amount'],
      },
    ],
  });

  return transaction;
};

const getAllTransactions = () => Transaction.findAll();

module.exports = {
  createTransaction,
  showTransaction,
  getAllTransactions,
};
