const BaseError = require('./base');
const BadRequestError = require('./bad-request');
const InternalServerError = require('./internal-server');
const UnprocessableEntityError = require('./unprocessable-entity');
const notAllowedError = require('./method-not-allowed');
const NotFoundError = require('./not-found');


module.exports = {
  BaseError,
  BadRequestError,
  InternalServerError,
  UnprocessableEntityError,
  notAllowedError,
  NotFoundError,
};
