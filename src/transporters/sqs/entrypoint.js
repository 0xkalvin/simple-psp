const logger = require('../../lib/logger')('SQS_ENTRYPOINT');
const sqsConfig = require('../../config/sqs');
const SQSPoller = require('../../lib/sqs-poller');
const { postgres, sqs } = require('../../data-sources');

const payableWorkers = require('./workers/payable');
const transactionWorkers = require('./workers/transaction');

const queueToWorkerMap = new Map([
  ['payables-creation-queue', payableWorkers.createPayable],
  ['payables-settlement-queue', payableWorkers.settlePayables],
  ['transactions-settlement-queue', transactionWorkers.settleTransactions],
]);

async function gracefullyShutdown() {
  try {
    await Promise.all([
      postgres.closeConnection(),
    ]);

    logger.info({
      message: 'Cleanup has finished and process is about to shutdown',
      uptime: process.uptime(),
    });

    process.exit(0);
  } catch (error) {
    logger.error({
      message: 'Failed to gracefully shutdown worker',
      error_message: error.message,
      error_stack: error.stack,
    });
  }
}

async function run() {
  try {
    await Promise.all([
      postgres.checkConnection(),
      sqs.checkConnection(),
    ]);

    logger.info({
      message: 'SQS Worker successfully connected to data sources',
    });
  } catch (error) {
    logger.fatal({
      message: 'Failed to connect to data sources, exiting now',
      error_message: error.message,
      error_stack: error.stack,
    });

    process.exit(1);
  }

  sqsConfig.workerQueues.forEach((queue) => {
    const worker = queueToWorkerMap.get(queue.name);

    if (!worker) {
      logger.warn({
        message: 'There is no worker for queue',
        queue_name: queue.name,
      });

      return;
    }

    const poller = new SQSPoller({
      queueUrl: queue.queueURL,
      sqsClient: sqs.sqsClient,
    });

    logger.info({
      message: `Starting a worker for queue ${queue.name}`,
    });

    poller.start({
      eachMessage: worker(queue),
    });

    poller.on('error', (error) => {
      logger.error({
        message: 'Failed to process message',
        queue_name: queue.name,
        error_message: error.message,
        error_stack: error.stack,
      });
    });
  });

  process.once('SIGTERM', async () => {
    await gracefullyShutdown();
  });
  process.once('SIGINT', async () => {
    await gracefullyShutdown();
  });
}

run();
