const { SQS, Credentials } = require('aws-sdk');
const config = require('./config');

const initializeSQS = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      sqs: new SQS({
        endpoint: config.endpoint,
        region: config.region,
      }),
      config,
    };
  }

  return {
    sqs: new SQS({
      endpoint: config.endpoint,
      region: config.region,
      credentials: new Credentials({
        accessKeyId: 'x',
        secretAccessKey: 'x',
      }),
    }),
    config,
  };
};

module.exports = initializeSQS;
