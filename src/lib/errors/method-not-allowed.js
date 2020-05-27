const BaseError = require('./base');


class NotAllowedError extends BaseError {
  constructor(message) {
    super(message);
    this.statusCode = 405;
    this.type = 'method-not-allowed';
  }
}


module.exports = NotAllowedError;
