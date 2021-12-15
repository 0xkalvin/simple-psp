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

const discountFee = (amount, fee) => ((100 - fee) * amount) / 100;

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
    paymentMethod,
  } = transaction;

  const { status, fee, daysUntilPayment } = payablesRules[paymentMethod];

  const payableAmount = discountFee(amount, fee);
  const payablePaymentDate = setPaymentDate(
    createdAt,
    daysUntilPayment,
  );

  return {
    fee,
    status,
    transaction_id: id,
    amount: payableAmount,
    payment_date: payablePaymentDate,
  };
}

async function createPayable(payload) {
  try {
    const {
      fee,
      status,
      transactionid,
      amount,
      paymentDate,
      paymentMethod,
    } = payload;

    const payable = await payableRepository.createPayable({
      fee,
      status,
      transactionid,
      amount,
      paymentDate,
      paymentMethod,
    });

    logger.debug({
      message: 'Successfully created payable',
      transaction_id: payable.transaction_id,
      payable_id: payable.id,
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

  const payables = await payableRepository.getPayables({
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
