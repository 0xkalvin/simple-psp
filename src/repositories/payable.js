const crypto = require('crypto');

const logger = require('../lib/logger')('PAYABLE_REPOSITORY');
const { sqs } = require('../data-sources');
const sqsConfig = require('../config/sqs');
const { postgres } = require('../data-sources');

async function enqueuePayableCreation(payload) {
  try {
    const result = await sqs.sqsClient.sendMessage({
      MessageBody: JSON.stringify(payload),
      QueueUrl: sqsConfig.payableQueueURL,
      MessageGroupId: crypto.randomUUID(),
    }).promise();

    return result;
  } catch (error) {
    logger.error({
      message: 'Failed to enqueue creation payable on sqs',
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function createPayable(payload) {
  const databaseTransaction = await postgres.pool.transaction();

  try {
    const {
      fee,
      status,
      transactionid,
      amount,
      paymentDate,
    } = payload;

    const createdPayable = await postgres.pool.models.Payable.create(
      {
        amount,
        fee,
        status,
        transaction_id: transactionid,
        payment_date: paymentDate,
      },
      { transaction: databaseTransaction },
    );

    await databaseTransaction.commit();

    return {
      id: createdPayable.id,
      amount,
      fee,
      status,
      transaction_id: transactionid,
      payment_date: paymentDate,
    };
  } catch (error) {
    await databaseTransaction.rollback();

    logger.error({
      message: 'Failed to insert payable on postgres',
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function getPayables(filters) {
  const { limit, offset } = filters;

  const transactions = await postgres.pool.models.Payable.findAll({
    offset,
    limit,
    order: [
      ['created_at', 'DESC'],
    ],
  });

  return transactions;
}

async function getPayableById(payableId) {
  const transaction = await postgres.pool.models.Payable.findOne({
    where: {
      id: payableId,
    },
  });

  return transaction;
}

module.exports = {
  createPayable,
  enqueuePayableCreation,
  getPayableById,
  getPayables,
};
