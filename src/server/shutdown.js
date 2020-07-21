const logger = require('../lib/logger');

const setupGracefulShutdown = (process, server, database) => {
  const shutdown = (signal) => {
    logger.info({
      message: 'gracefully-shutting-down',
      signal,
    });

    server.close(() => {
      database.close().then(() => {
        process.exit(0);
      });
    });
  };

  const signals = ['SIGHUP', 'SIGINT', 'SIGTERM', 'SIGUSR2'];

  signals.forEach((signal) => {
    process.on(signal, shutdown);
  });
};

module.exports = {
  setupGracefulShutdown,
};
