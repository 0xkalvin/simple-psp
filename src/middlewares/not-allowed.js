const {notAllowedError} = require('../lib/errors');

module.exports = (req, res) => {
  const message = `Method "${req.method}" is not allowed for resource "${req.path}"`;
  throw new notAllowedError(message);
};
