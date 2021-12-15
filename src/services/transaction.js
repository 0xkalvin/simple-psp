const payableRepository = require('../repositories/payable');
const payableService = require('./payable');
const transactionRepository = require('../repositories/transaction');
const transactionValidator = require('../validators/transaction');

const logger = require('../lib/logger')('TRANSACTION_SERVICE');
const errors = require('../lib/errors');
const { parsePaginationParameters } = require('../lib/pagination');

const getCardLastFourNumbers = (cardNumber) => cardNumber.substr(-4);

async function createTransaction(payload) {
  const {
    amount,
    description,
    cardExpirationDate,
    cardHolderName,
    cardNumber,
    cardVerificationCode,
    paymentMethod,
  } = payload;

  const { error: validationError } = transactionValidator.validateTransactionCreationPayload({
    amount,
    description,
    cardExpirationDate,
    cardHolderName,
    cardNumber,
    cardVerificationCode,
    paymentMethod,
  });

  if (validationError) {
    throw new errors.UnprocessableEntityError(validationError);
  }

  try {
    const cardLastFourNumbers = getCardLastFourNumbers(cardNumber);

    const transaction = await transactionRepository.createTransaction({
      amount,
      description,
      cardExpirationDate,
      cardHolderName,
      cardLastFourNumbers,
      cardVerificationCode,
      paymentMethod,
    });

    const payablePayload = payableService.buildPayablePayloadFromTransaction({
      amount,
      createdAt: transaction.createdAt,
      id: transaction.id,
      paymentMethod,
    });

    payableRepository.enqueuePayableCreation(payablePayload);

    logger.debug({
      message: 'Successfully created transaction',
      transaction_id: transaction.id,
    });

    return transaction;
  } catch (error) {
    logger.error({
      message: 'Failed to create transaction',
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function getTransactions(filters) {
  const { limit, offset } = parsePaginationParameters(filters.page, filters.limit);

  const transactions = await transactionRepository.getTransactions({
    limit,
    offset,
  });

  return transactions;
}

async function getOneTransaction(id) {
  const transaction = await transactionRepository.getTransactionById(id);

  return transaction;
}

module.exports = {
  createTransaction,
  getOneTransaction,
  getTransactions,
};
