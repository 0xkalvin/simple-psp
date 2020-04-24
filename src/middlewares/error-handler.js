const { buildFailureResponse } = require('../lib/http/response');


module.exports = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || err.status || 500;
    const payload = status < 500 ? { type: 'Bad Request' } : { type: 'Internal Server Error'}
    return buildFailureResponse(req, res, status, [ payload ]);
}