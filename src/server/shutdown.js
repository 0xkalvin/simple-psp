const setupGracefulShutdown = (process, server, database) => {
  const shutdown = (signal) => {
    console.log(`\nGracefully shutting down with signal ${signal}...`);

    server.close(() => {
      database.close().then(() => {
        process.exit(0);
      });
    });
  };

  const signals = ["SIGHUP", "SIGINT", "SIGTERM", "SIGUSR2"];

  signals.forEach((signal) => {
    process.on(signal, shutdown);
  });
};

module.exports = {
  setupGracefulShutdown,
};
