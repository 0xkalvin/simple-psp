const crypto = require('crypto');
const moment = require('moment');

const logger = require('../lib/logger')('PAYABLE_SERVICE');
const payableRepository = require('../repositories/payable');
const transactionRepository = require('../repositories/transaction');
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
  const createdAtAsDate = moment(transactionDate).utc();
  const paymentDate = createdAtAsDate.add(daysUntilPayment, 'days');

  return paymentDate;
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

async function enqueuePayablesToSettle(payload) {
  const {
    customerId,
    transactionId,
  } = payload;

  let offset = payload.offset || 0;
  const limit = payload.limit || 10000;
  const paymentDate = payload.paymentDate || moment()
    .utc()
    .startOf('day')
    .format('YYYY-MM-DD');

  try {
    let isDone = false;
    let batchCount = 1;

    do {
      let batchStartTime = Date.now();

      const { ids, isLast } = await payableRepository.getPayablesIdsToSettle({
        customerId,
        paymentDate,
        transactionId,
        limit,
        offset,
      });

      offset += limit;
      isDone = isLast;

      logger.info({
        message: `Fetched payable batch ${batchCount}`,
        is_last: isLast,
        batch_size: ids.length,
        latency: Date.now() - batchStartTime,
      });

      batchStartTime = Date.now();

      await payableRepository.enqueuePayablesToSettle(ids);

      logger.info({
        message: `Enqueued payable batch ${batchCount}`,
        is_last: isLast,
        batch_size: ids.length,
        latency: Date.now() - batchStartTime,
      });

      if (!isLast) {
        batchCount += 1;
      }
    } while (!isDone);
  } catch (error) {
    logger.error({
      message: 'Failed to settle payables',
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function settlePayables(payableIds) {
  const ids = payableIds.map(({ id }) => id);

  const updatedPayables = await payableRepository.settlePayables(ids);

  await transactionRepository.enqueueTransactionsToSettle(updatedPayables);
}

module.exports = {
  buildPayablePayloadFromTransaction,
  createPayable,
  getPayables,
  getOnePayable,
  enqueuePayablesToSettle,
  settlePayables,
};
