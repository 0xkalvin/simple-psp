const pino = require('pino');

const {
  APP_NAME,
  APP_TYPE,
  LOG_LEVEL,
  NODE_ENV,
} = process.env;

module.exports = (name) => pino({
  name,
  level: LOG_LEVEL,
  nestedKey: 'data',
  formatters: {
    level: (label) => ({ level: label }),
  },
  messageKey: 'message',
  timestamp: pino.stdTimeFunctions.isoTime,
  mixin() {
    return {
      app_name: APP_NAME,
      app_type: APP_TYPE,
      env: NODE_ENV,
    };
  },
});
