const app = require('../server/app');
const database = require('../database');
const logger = require('../lib/logger');

const { ensureDatabaseIsConnected } = require('../lib/database');
const { setupGracefulShutdown } = require('../server/shutdown');

const { PORT = 3000, NODE_ENV } = process.env;

const onListening = () => (
  logger.info({
    message: 'Server is up and kicking',
    event: 'server_startup',
    address: `http://localhost:${PORT}`,
    env: NODE_ENV,
  })
);

const startServer = (app) => app.listen(PORT, onListening);

const handleInitializationError = (err) => {
  logger.error({
    message: 'Server has failed to initialize',
    event: 'server_startup_failed',
    err_message: err.message,
    err_stack: err.stack,
  });

  process.exit(1);
};

const initPSP = (app, database) => {
  ensureDatabaseIsConnected(database)
    .then(() => startServer(app))
    .then(setupGracefulShutdown(process))
    .catch(handleInitializationError);
};

initPSP(app, database);
