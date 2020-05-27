const { NotFoundError } = require("../lib/errors");

module.exports = (req, res) => {
  const message = `Resource "${req.path}" not found`;
  throw new NotFoundError(message);
};
