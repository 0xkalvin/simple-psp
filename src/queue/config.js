module.exports = {
  endpoint: process.env.SQS_ENDPOINT || 'http://localhost:9324',
  region: process.env.SQS_REGION || 'us-east-1',
  'payables-queue': {
    concurrency: process.env.SQS_CONCURRENCY || 10,
    name: process.env.PAYABLES_QUEUE,
  },
};
