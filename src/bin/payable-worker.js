const database = require('../database');
const payableQueue = require('../resources/payable/queue');
const logger = require('../lib/logger');

const run = async () => {
  const { Payable } = database.models;

  const data = await payableQueue.receiveAndDeleteMessage();

  if (!data) {
    logger.info({
      message: 'No payable to process',
      event: 'processing_payables_from_queue',
    });

    return;
  }

  const message = data.Messages[0];

  const databaseTransaction = await database.transaction();

  try {
    const payablePayload = JSON.parse(message.Body);

    const payable = await Payable.create(payablePayload, { transaction: databaseTransaction });

    await databaseTransaction.commit();

    logger.info({
      message: 'Successfully created payables',
      event: 'payable_creation',
      payable_id: payable.id,
    });
  } catch (error) {
    logger.error({
      message: 'Failed to create payables',
      event: 'payable_creation',
      err_message: error.message,
      err_stack: error.stack,
    });

    await databaseTransaction.rollback();

    payableQueue.push(message);
  }
};

const { NODE_ENV } = process.env;

logger.info({
  message: 'Payables worker running',
  event: 'payables_worker_startup',
  env: NODE_ENV,
});

setInterval(run, 3000);
