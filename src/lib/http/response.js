const buildSuccessResponse = (res, status, data = {}) => res.status(status).send(data);

const buildFailureResponse = (req, res, parsedError) => {
  const {
    statusCode, type, message, details,
  } = parsedError;
  const failureResponse = {
    error: {
      type,
      message,
      details,
    },
    url: req.path,
    method: req.method,
  };

  return res.status(statusCode).send(failureResponse);
};

module.exports = {
  buildFailureResponse,
  buildSuccessResponse,
};
