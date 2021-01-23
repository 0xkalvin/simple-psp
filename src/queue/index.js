const { SQS, Credentials } = require('aws-sdk');
const http = require('http');
const https = require('https');

const config = require('./config');

const initializeSQS = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      sqs: new SQS({
        endpoint: config.endpoint,
        region: config.region,
        httpOptions: {
          agent: new https.Agent({
            keepAlive: true,
          }),
        },
      }),
      ...config,
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
      httpOptions: {
        agent: new http.Agent({
          keepAlive: true,
        }),
      },
    }),
    ...config,
  };
};

module.exports = initializeSQS();
