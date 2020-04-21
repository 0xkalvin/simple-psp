const app = require("../server/app");
const database = require("../database");

const { ensureDatabaseIsConnected } = require("../lib/database");
const { setupGracefulShutdown } = require("../server/shutdown");

const { PORT = 3000 } = process.env;

const onListening = () =>
  console.log(`Server is running on http://localhost:${PORT}`);

const startServer = (app) => app.listen(PORT, onListening);

const initApplication = (app, database) => {
  ensureDatabaseIsConnected(database)
    .then(() => startServer(app))
    .then((server) => setupGracefulShutdown(server, database))
    .catch(console.error);
};

initApplication(app, database);
