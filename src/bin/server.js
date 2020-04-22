const app = require("../server/app");
const database = require("../database");

const { ensureDatabaseIsConnected } = require("../lib/database");
const { setupGracefulShutdown } = require("../server/shutdown");

const { PORT = 3000 } = process.env;

const onListening = () =>
  console.log(`Server is running on http://localhost:${PORT}`);

const startServer = app => app.listen(PORT, onListening);


const handleInitializationError = err => {
  console.error(err);

  process.exit(1);
}

const initPSP = (app, database) => {
  ensureDatabaseIsConnected(database)
    .then(() => startServer(app))
    .then((server) => setupGracefulShutdown(process, server, database))
    .catch(handleInitializationError);
};

initPSP(app, database);
