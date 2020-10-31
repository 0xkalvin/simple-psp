const logger = require('../lib/logger');

const setupGracefulShutdown = (process) => (server) => {
  const shutdown = (signal) => {
    logger.info({
      message: 'Server is gracefully shutting down...',
      event: 'server_shutdown',
      signal,
    });

    server.close(() => {
      logger.info({
        message: 'Server has closed. Exiting process...',
        event: 'server_shutdown',
        signal,
      });

      process.exit(0);
    });
  };

  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM'];

  signals.forEach((signal) => {
    process.on(signal, shutdown);
  });
};

module.exports = {
  setupGracefulShutdown,
};
