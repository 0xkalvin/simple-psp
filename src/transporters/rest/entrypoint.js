const http = require('http');
const terminus = require('@godaddy/terminus');

const application = require('./application');
const logger = require('../../lib/logger')('REST_SERVER_ENTRYPOINT');

const { postgres, sqs } = require('../../data-sources');

const {
  PORT,
} = process.env;

async function run() {
  try {
    await Promise.all([
      postgres.checkConnection(),
      sqs.checkConnection(),
    ]);
  } catch (error) {
    logger.fatal({
      message: 'Failed to connect to data sources, exiting now',
      error_message: error.message,
      error_stack: error.stack,
    });

    process.exit(1);
  }

  const server = http.createServer(application);

  terminus.createTerminus(server, {
    healthChecks: {
      '/_liveness_check_': () => Promise.resolve(),
      '/_readiness_check_': async () => {
        try {
          await Promise.all([
            postgres.checkConnection(),
            sqs.checkConnection(),
          ]);

          return null;
        } catch (error) {
          logger.error({
            message: 'Readiness check failed',
            error_message: error.message,
            error_stack: error.stack,
          });

          return Promise.reject(new Error('Unable to handle requests'));
        }
      },
    },
    onSignal: async () => {
      try {
        await postgres.closeConnection();

        logger.info({
          message: 'Closed postgres connection',
        });
      } catch (error) {
        logger.error({
          message: 'Failed to close postgres connection',
          error_message: error.message,
          error_stack: error.stack,
        });
      }
    },
    onShutdown: () => {
      logger.info({
        message: 'Cleanup has finished and process is about to shutdown',
        uptime: process.uptime(),
      });
    },
    signals: ['SIGTERM', 'SIGINT'],
    timeout: 20000,
  });

  server.listen(PORT, () => {
    logger.info({
      message: 'Server is up and kicking',
      port: PORT,
    });
  });
}

run();
