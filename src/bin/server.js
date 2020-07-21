const app = require('../server/app');
const database = require('../database');
const logger = require('../lib/logger');

const { ensureDatabaseIsConnected } = require('../lib/database');
const { setupGracefulShutdown } = require('../server/shutdown');

const { PORT = 3000, NODE_ENV } = process.env;

const onListening = () => (
  logger.info({
    status: 'Running',
    address: `http://localhost:${PORT}`,
    env: NODE_ENV,
  })
);

const startServer = (app) => app.listen(PORT, onListening);

const handleInitializationError = (err) => {
  logger.error(err);

  process.exit(1);
};

const initPSP = (app, database) => {
  ensureDatabaseIsConnected(database)
    .then(() => startServer(app))
    .then((server) => setupGracefulShutdown(process, server, database))
    .catch(handleInitializationError);
};

initPSP(app, database);
