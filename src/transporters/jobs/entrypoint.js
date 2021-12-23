const { postgres, sqs } = require('../../data-sources');
const logger = require('../../lib/logger')('JOBS_ENTRYPOINT');

const payableService = require('../../services/payable');

const jobsMap = new Map([
  ['settle-payables', {
    runner: payableService.enqueuePayablesToSettle,
  }],
]);

async function run() {
  try {
    await Promise.all([
      postgres.checkConnection(),
      sqs.checkConnection(),
    ]);
  } catch (error) {
    logger.fatal({
      message: 'Failed to connect to data sources, exiting now',
      error_message: error.message,
      error_stack: error.stack,
    });

    process.exit(1);
  }

  const {
    npm_config_jobname: jobName,
    npm_config_paymentdate: paymentDate,
  } = process.env;

  if (!jobName || !jobsMap.has(jobName)) {
    throw new Error('Invalid job name');
  }

  const startTime = Date.now();

  try {
    const job = jobsMap.get(jobName);
    const input = {
      paymentDate,
    };

    logger.info({
      message: `Starting job ${jobName}`,
      input,
    });

    await job.runner(input);
  } catch (error) {
    logger.fatal({
      message: `Failed run job ${jobName}`,
      error_message: error.message,
      error_stack: error.stack,
    });
  } finally {
    logger.info({
      message: `Job ${jobName} has finished`,
      latency: Date.now() - startTime,
    });
  }
}

run();
