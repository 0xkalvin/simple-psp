#!/usr/bin/env bash

node_modules/.bin/sequelize db:create --config src/database/config.js

node_modules/.bin/sequelize db:migrate --config src/database/config.js --migrations-path src/database/migrations/

