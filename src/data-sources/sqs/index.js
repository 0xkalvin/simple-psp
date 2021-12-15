const { SQS } = require('aws-sdk');
const http = require('http');
const https = require('https');

const config = require('../../config/sqs');

const { NODE_ENV } = process.env;

function initializeSQS() {
  const isProd = NODE_ENV === 'production';
  const protocol = isProd ? https : http;

  const agent = new protocol.Agent({
    keepAlive: true,
  });

  return new SQS({
    endpoint: config.endpoint,
    region: config.region,
    httpOptions: {
      agent,
    },
    maxRetries: config.maxRetries,
  });
}

const sqsClient = initializeSQS();

function checkConnection() {
  return sqsClient.listQueueTags({
    QueueUrl: config.payableQueueURL,
  }).promise();
}

module.exports = {
  checkConnection,
  initializeSQS,
  sqsClient,
};
