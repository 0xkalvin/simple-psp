#!/bin/sh

node_modules/.bin/sequelize db:migrate --config src/database/config.js --migrations-path src/database/migrations/

node src/bin/server.js