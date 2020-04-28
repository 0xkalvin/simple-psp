const logger = require('../logger');

const buildSuccessResponse = (res, status, data = {}) => {
    return res.status(status).send(data);
}

const buildFailureResponse = (req, res, parsedError, rawError = undefined) => {
    
    const { statusCode, type, message, payload = [] } = parsedError;

    const failureResponse = {
        error: { type, message, payload },
        url: req.path,
        method: req.method
    };

    logger.error({ 
        url: req.path,
        method: req.method,
        statusCode,
        error: rawError ? rawError.message : null,
        stack: rawError && rawError.stack ? rawError.stack.split('\n') : null, 
        responsePayload: payload,
    });

    return res.status(statusCode).send(failureResponse);
}




module.exports = {
    buildFailureResponse,
    buildSuccessResponse,
}