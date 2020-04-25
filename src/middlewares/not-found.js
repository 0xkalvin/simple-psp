const { NotFoundError } = require("../lib/errors");
const { buildFailureResponse } = require("../lib/http/response");

module.exports = (req, res) => {
  const message = `Resource "${req.path}" not found`;
  return buildFailureResponse(req, res, new NotFoundError(message));
};
