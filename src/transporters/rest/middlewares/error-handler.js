const logger = require('../../../lib/logger')('ERROR_HANDLER');
const {
  InternalServerError,
  BadRequestError,
  BaseError,
} = require('../../../lib/errors');

module.exports = (error, request, response, next) => {
  const normalizeError = (err) => {
    if (err instanceof BaseError) {
      return err;
    } if (err.type === 'entity.parse.failed') {
      return new BadRequestError(err.message);
    }

    return new InternalServerError();
  };

  const normalizedError = normalizeError(error);

  logger.error({
    url: request.path,
    method: request.method,
    statusCode: normalizedError.statusCode,
    error: error ? error.message : null,
    stack: error && error.stack ? error.stack : null,
    details: normalizedError.details,
  });

  return response.status(normalizedError.statusCode).json({
    message: normalizedError.message,
    type: normalizedError.type,
    details: normalizedError.details,
  });
};
