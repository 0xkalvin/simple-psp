const crypto = require('crypto');

const logger = require('../lib/logger')('PAYABLE_REPOSITORY');
const { sqs } = require('../data-sources');
const sqsConfig = require('../config/sqs');
const { postgres } = require('../data-sources');

const MAX_IDS_PER_MESSAGE = 10;

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
      amount,
      customerId,
      fee,
      id,
      paymentDate,
      status,
      transactionid,
    } = payload;

    const createdPayable = await postgres.pool.models.Payable.create(
      {
        amount,
        customer_id: customerId,
        fee,
        id,
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
      customerId,
      fee,
      status,
      transactionid,
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
  const { customerId, limit, offset } = filters;

  const payables = await postgres.pool.models.Payable.findAll({
    offset,
    limit,
    order: [
      ['created_at', 'DESC'],
    ],
    where: {
      customer_id: customerId,
    },
  });

  return payables;
}

async function getPayableById(payableId) {
  const payable = await postgres.pool.models.Payable.findOne({
    where: {
      id: payableId,
    },
  });

  return payable;
}

async function getPayablesIdsToSettle(filters) {
  const {
    customerId,
    limit,
    offset,
    paymentDate,
    transactionId,
  } = filters;

  const whereClause = {
    payment_date: paymentDate,
    status: 'waiting_funds',
  };

  if (customerId) {
    whereClause.customer_id = customerId;
  }

  if (transactionId) {
    whereClause.transaction_id = transactionId;
  }

  const options = {
    attributes: [
      'id',
    ],
    offset,
    limit,
    order: [
      ['created_at', 'DESC'],
    ],
    raw: true,
    where: whereClause,
  };

  const result = await Promise.all([
    postgres.pool.models.Payable.findAll(options),
    postgres.pool.models.Payable.findOne({
      ...options,
      offset: offset + limit,
    }),
  ]);

  return {
    ids: result[0],
    isLast: !result[1],
  };
}

async function enqueuePayablesToSettle(payableIds) {
  try {
    let startIndex = 0;
    let idsPerMessage = 0;

    const promises = [];

    for (let index = 0; index <= payableIds.length; index += 1) {
      if (idsPerMessage >= MAX_IDS_PER_MESSAGE || index === payableIds.length) {
        const promise = sqs.sqsClient.sendMessage({
          MessageBody: JSON.stringify(payableIds.slice(startIndex, index)),
          QueueUrl: sqsConfig.payableSettlementQueueURL,
          MessageGroupId: crypto.randomUUID(),
        }).promise();

        startIndex = index;
        idsPerMessage = 0;

        promises.push(promise);
      } else {
        idsPerMessage += 1;
      }
    }

    await Promise.all(promises);
  } catch (error) {
    logger.error({
      message: 'Failed to enqueue payables to settle',
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function settlePayables(payableIds) {
  const result = await postgres.pool.models.Payable.update(
    {
      status: 'paid',
    },
    {
      raw: true,
      returning: ['transaction_id'],
      where: {
        id: {
          [postgres.pool.Sequelize.Op.in]: payableIds,
        },
      },
    },
  );

  return result[1].map((payable) => ({ transactionId: payable.transaction_id }));
}

module.exports = {
  createPayable,
  enqueuePayableCreation,
  enqueuePayablesToSettle,
  getPayableById,
  getPayables,
  getPayablesIdsToSettle,
  settlePayables,
};
