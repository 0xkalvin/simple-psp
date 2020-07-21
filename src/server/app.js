const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes');

const errorHandler = require('../middlewares/error-handler');
const notFoundHandler = require('../middlewares/not-found');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
