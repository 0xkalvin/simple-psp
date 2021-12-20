const crypto = require('crypto');

const payableRepository = require('../repositories/payable');
const payableService = require('./payable');
const transactionRepository = require('../repositories/transaction');
const transactionValidator = require('../validators/transaction');

const logger = require('../lib/logger')('TRANSACTION_SERVICE');
const errors = require('../lib/errors');
const { parsePaginationParameters } = require('../lib/pagination');

const getCardLastFourNumbers = (cardNumber) => cardNumber.substr(-4);

const transactionRules = {
  credit_card: {
    status: 'pending_payment',
  },
  debit_card: {
    status: 'paid',
  },
};

async function createTransaction(payload) {
  const {
    amount,
    description,
    cardExpirationDate,
    cardHolderName,
    cardNumber,
    cardVerificationCode,
    customerId,
    paymentMethod,
  } = payload;

  const { error: validationError } = transactionValidator.validateTransactionCreationPayload({
    amount,
    description,
    cardExpirationDate,
    cardHolderName,
    cardNumber,
    cardVerificationCode,
    customerId,
    paymentMethod,
  });

  if (validationError) {
    throw new errors.UnprocessableEntityError(validationError);
  }

  try {
    const cardLastFourNumbers = getCardLastFourNumbers(cardNumber);
    const id = crypto.randomUUID();
    const { status } = transactionRules[paymentMethod];

    const transaction = await transactionRepository.createTransaction({
      amount,
      description,
      cardExpirationDate,
      cardHolderName,
      cardLastFourNumbers,
      cardVerificationCode,
      customerId,
      id,
      paymentMethod,
      status,
    });

    const payablePayload = payableService.buildPayablePayloadFromTransaction({
      amount,
      createdAt: transaction.createdAt,
      customerId,
      id: transaction.id,
      paymentMethod,
    });

    payableRepository.enqueuePayableCreation(payablePayload);

    logger.debug({
      message: 'Successfully created transaction',
      transaction_id: transaction.id,
      customer_id: customerId,
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

  const { customerId } = filters;

  const { error: validationError } = transactionValidator.validateTransactionListPayload({
    customerId,
  });

  if (validationError) {
    throw new errors.UnprocessableEntityError(validationError);
  }

  const transactions = await transactionRepository.getTransactions({
    customerId,
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
