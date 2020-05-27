const logger = require('../lib/logger');
const { buildFailureResponse } = require("../lib/http/response");
const { 
  InternalServerError, 
  BadRequestError, 
  BaseError, 
} = require("../lib/errors");

module.exports = (err, req, res, next) => {
  const normalizeError = (err) => {
    if(err instanceof BaseError){
      return err;    
    } else if (err.type === 'entity.parse.failed') {
      return new BadRequestError(err.message);
    }
    
    return new InternalServerError();
  };
  
  const normalizedError = normalizeError(err);

  logger.error({ 
    url: req.path,
    method: req.method,
    statusCode: normalizedError.statusCode,
    error: err ? err.message : null,
    stack: err && err.stack ? err.stack.split('\n') : null, 
    details: normalizedError.details,
});

  return buildFailureResponse(req, res, normalizedError);
};
