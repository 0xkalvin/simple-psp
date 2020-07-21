const database = require('../database');
const payableQueue = require('../resources/payable/queue');
const logger = require('../lib/logger');

const run = async () => {
  const { Payable } = database.models;

  const data = await payableQueue.receiveAndDeleteMessage();

  if (!data) {
    logger.info({
      message: 'No payable to process',
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
      event: 'payable-successfully-created',
      payable_id: payable.id,
    });
  } catch (error) {
    logger.error({
      event: 'payable-creation-failed',
      err_message: error.message,
      err_stack: error.stack,
    });

    await databaseTransaction.rollback();

    payableQueue.push(message);
  }
};

const { NODE_ENV } = process.env;

logger.info({
  status: 'Payable worker running',
  env: NODE_ENV,
});

setInterval(run, 3000);
