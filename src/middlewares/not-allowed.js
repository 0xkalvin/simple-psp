const { notAllowedError } = require("../lib/errors");
const { buildFailureResponse } = require('../lib/http/response');

module.exports = (req, res) => {
    const message = `Method "${req.method}" is not allowed for resource "${req.path}"`;
    return buildFailureResponse(req, res, new notAllowedError(message));
}