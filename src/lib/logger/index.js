const log4js = require('log4js');

const setupLogger = () => {
  log4js.configure({
    appenders: {
      out: {
        type: 'stdout',
        layout: {
          type: 'coloured',
          pattern: '%d %p %m%n',
        },
      },
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'info',
      },
    },
  });

  const logger = log4js.getLogger();
  logger.level = 'ALL';

  return logger;
};

module.exports = setupLogger();
