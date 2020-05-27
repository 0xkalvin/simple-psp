const BaseError = require('./base');


class BadRequestError extends BaseError {
  constructor(context) {
    super('Bad request');
    this.statusCode = 400;
    this.type = 'bad_request';
    this.details = {context};
  }
}


module.exports = BadRequestError;
