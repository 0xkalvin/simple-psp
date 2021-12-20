const crypto = require('crypto');

const logger = require('../lib/logger')('PAYABLE_SERVICE');
const payableRepository = require('../repositories/payable');
const { parsePaginationParameters } = require('../lib/pagination');

const payablesRules = {
  credit_card: {
    status: 'waiting_funds',
    fee: 5,
    daysUntilPayment: 30,
  },
  debit_card: {
    status: 'paid',
    fee: 3,
    daysUntilPayment: 0,
  },
};

const discountFee = (amount, fee) => Math.ceil(((100 - fee) * amount) / 100);

const setPaymentDate = (transactionDate, daysUntilPayment) => {
  const createdAtAsDate = new Date(transactionDate);
  return createdAtAsDate.setDate(
    createdAtAsDate.getDate() + daysUntilPayment,
  );
};

function buildPayablePayloadFromTransaction(transaction) {
  const {
    amount,
    createdAt,
    id,
    customerId,
    paymentMethod,
  } = transaction;

  const { status, fee, daysUntilPayment } = payablesRules[paymentMethod];

  const payableAmount = discountFee(amount, fee);
  const payablePaymentDate = setPaymentDate(
    createdAt,
    daysUntilPayment,
  );

  return {
    amount: payableAmount,
    customer_id: customerId,
    fee,
    payment_date: payablePaymentDate,
    status,
    transaction_id: id,
  };
}

async function createPayable(payload) {
  try {
    const {
      amount,
      customerId,
      fee,
      paymentDate,
      paymentMethod,
      status,
      transactionid,
    } = payload;

    const id = crypto.randomUUID();

    const payable = await payableRepository.createPayable({
      amount,
      customerId,
      fee,
      id,
      paymentDate,
      paymentMethod,
      status,
      transactionid,
    });

    logger.debug({
      message: 'Successfully created payable',
      transaction_id: payable.transaction_id,
      payable_id: payable.id,
      customer_id: customerId,
    });

    return payable;
  } catch (error) {
    logger.error({
      message: 'Failed to create payable',
      transaction_id: payload.transaction_id,
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function getPayables(filters) {
  const { limit, offset } = parsePaginationParameters(filters.page, filters.limit);
  const { customerId } = filters;

  const payables = await payableRepository.getPayables({
    customerId,
    limit,
    offset,
  });

  return payables;
}

async function getOnePayable(id) {
  const payable = await payableRepository.getPayablesById(id);

  return payable;
}

module.exports = {
  buildPayablePayloadFromTransaction,
  createPayable,
  getPayables,
  getOnePayable,
};
