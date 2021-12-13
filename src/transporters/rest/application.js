const express = require('express');
const helmet = require('helmet');

const errorHandler = require('./middlewares/error-handler');
const notFoundHandler = require('./middlewares/not-found');

const payableController = require('./controllers/payable');
const transactionController = require('./controllers/transaction');

const application = express();

application.use(helmet());
application.use(express.json());

application.post('/transactions', transactionController.create);
application.get('/transactions', transactionController.list);
application.get('/transactions/:id', transactionController.show);
application.get('/payables', payableController.list);
application.get('/payables/:id', payableController.show);
application.use(notFoundHandler);
application.use(errorHandler);

module.exports = application;
