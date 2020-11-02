const database = require('../database');
const payableQueue = require('../resources/payable/queue');
const logger = require('../lib/logger');

const { Payable } = database.models;

const createPayable = async (payablePayload) => {
  logger.info({
    message: 'Preparing to create payable',
    event: 'payable_creation',
    transaction_id: payablePayload.transaction_id,
  });

  const databaseTransaction = await database.transaction();

  try {
    const payable = await Payable.create(payablePayload, { transaction: databaseTransaction });

    await databaseTransaction.commit();

    logger.info({
      message: 'Successfully created payable',
      event: 'payable_creation',
      transaction_id: payablePayload.transaction_id,
      payable_id: payable.id,
    });
  } catch (error) {
    logger.error({
      message: 'Failed to create payable',
      event: 'payable_creation',
      transaction_id: payablePayload.transaction_id,
      err_message: error.message,
      err_stack: error.stack,
    });

    await databaseTransaction.rollback();
  }
};

(function run() {
  const { NODE_ENV } = process.env;

  logger.info({
    message: 'Payables worker running',
    event: 'payables_worker_startup',
    env: NODE_ENV,
  });

  setInterval(
    async () => {
      await payableQueue.process(createPayable);
    },
    3000,
  );
}());

(function setupGracefulShutdown(process) {
  const shutdown = async (signal) => {
    const wait = () => new Promise((resolve) => setTimeout(() => resolve(), 3000));

    logger.info({
      message: 'Worker is gracefully shutting down...',
      event: 'payables_worker_shutdown',
      signal,
    });

    await wait();

    logger.info({
      message: 'Exiting process...',
      event: 'payables_worker_shutdown',
      signal,
    });

    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
}(process));
