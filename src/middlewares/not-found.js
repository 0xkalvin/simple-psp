

const { buildFailureResponse } = require('../lib/http/response');


module.exports = (req, res) => {
    const payload = { error: `Resource "${req.path}" not found`};
    return buildFailureResponse(res, 404, payload);
}