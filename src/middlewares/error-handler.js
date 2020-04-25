const { InternalServerError, BadRequestError } = require("../lib/errors");
const { buildFailureResponse } = require("../lib/http/response");

module.exports = (err, req, res, next) => {
  const normalizeError = (err) => {
    const status = err.statusCode || err.status || 500;

    if (status < 500) {
      return new BadRequestError();
    }

    return new InternalServerError();
  };

  console.error(err.stack);

  const normalizedError = normalizeError(err);

  return buildFailureResponse(req, res, normalizedError);
};
