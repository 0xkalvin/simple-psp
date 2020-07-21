class BaseError extends Error {
  constructor(message, statusCode, type, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
  }
}

module.exports = BaseError;
