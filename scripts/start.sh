#!/bin/sh

if [ $APP_TYPE = "server" ]; then
    node_modules/.bin/sequelize db:migrate --config src/database/config.js --migrations-path src/database/migrations/

    node src/bin/server.js
else
    node src/bin/payable-worker.js
fi