module.exports = {
  endpoint: process.env.SQS_ENDPOINT,
  maxRetries: process.env.SQS_MAX_RETRIES,
  payableQueueURL: process.env.SQS_PAYABLES_QUEUE_URL,
  region: process.env.SQS_REGION,
  workerQueues: [
    {
      concurrency: process.env.SQS_CONCURRENCY,
      queueURL: process.env.SQS_PAYABLES_QUEUE_URL,
      name: 'payables-creation-queue',
    },
  ],
};
