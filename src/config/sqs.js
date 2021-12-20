module.exports = {
  endpoint: process.env.SQS_ENDPOINT,
  maxRetries: process.env.SQS_MAX_RETRIES,
  payableQueueURL: process.env.SQS_PAYABLES_CREATION_QUEUE_URL,
  payableSettlementQueueURL: process.env.SQS_PAYABLES_SETTLEMENT_QUEUE_URL,
  transactionSettlementQueueURL: process.env.SQS_TRANSACTIONS_SETTLEMENT_QUEUE_URL,
  region: process.env.SQS_REGION,
  workerQueues: [
    {
      concurrency: process.env.SQS_CONCURRENCY,
      queueURL: process.env.SQS_PAYABLES_CREATION_QUEUE_URL,
      name: 'payables-creation-queue',
    },
    {
      concurrency: process.env.SQS_CONCURRENCY,
      queueURL: process.env.SQS_PAYABLES_SETTLEMENT_QUEUE_URL,
      name: 'payables-settlement-queue',
    },
    {
      concurrency: process.env.SQS_CONCURRENCY,
      queueURL: process.env.SQS_TRANSACTIONS_SETTLEMENT_QUEUE_URL,
      name: 'transactions-settlement-queue',
    },
  ],
};
