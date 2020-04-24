const { buildFailureResponse } = require("../lib/http/response");

module.exports = (req, res) => {
  const payload = { error: `Resource "${req.path}" not found` };
  return buildFailureResponse(req, res, 404, [payload]);
};
