const Promise = require('bluebird');

const ensureDatabaseIsConnected = (db) => {
  const MAX_RETRIES = 10;
  const RETRY_TIMEOUT = 1000;

  const tryToConnect = (retry = 1) => db.authenticate()
    .catch((err) => {
      if (retry <= MAX_RETRIES) {
        return Promise.delay(RETRY_TIMEOUT)
          .then(() => tryToConnect(retry + 1));
      }
      console.error(err);
      return Promise.reject(new Error('Database has failed to connect'));
    });

  return tryToConnect();
};

module.exports = {
  ensureDatabaseIsConnected,
};
