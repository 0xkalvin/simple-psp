const { buildFailureResponse } = require('../lib/http/response');


module.exports = (err, req, res, next) => {
    console.error(err);
    const status = 500;
    const payload = { error: 'Internal Server Error'}
    return buildFailureResponse(res, status, payload);
}