const BaseError = require('./base');

class UnprocessableEntityError extends BaseError {
  constructor(details = []) {
    super('Invalid request body');
    this.statusCode = 422;
    this.type = 'invalid_request_body';
    this.details = details;
  }
}

module.exports = UnprocessableEntityError;
