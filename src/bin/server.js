const app = require('../server/app');
const database = require('../database');
const logger = require('../lib/logger');

const { ensureDatabaseIsConnected } = require('../lib/database');
const { setupGracefulShutdown } = require('../server/shutdown');

const { PORT = 3000, NODE_ENV } = process.env;

const onListening = () => (
  logger.info({
    status: 'Server is up and kicking',
    address: `http://localhost:${PORT}`,
    env: NODE_ENV,
  })
);

const startServer = (app) => app.listen(PORT, onListening);

const handleInitializationError = (err) => {
  logger.error({
    event: 'initialization-failed',
    err_message: err.message,
    err_stack: err.stack,
  });

  process.exit(1);
};

const initPSP = (app, database) => {
  ensureDatabaseIsConnected(database)
    .then(() => startServer(app))
    .then((server) => setupGracefulShutdown(process, server, database))
    .catch(handleInitializationError);
};

initPSP(app, database);
