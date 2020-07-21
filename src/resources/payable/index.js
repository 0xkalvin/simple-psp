const service = require('./service');
const { buildSuccessResponse } = require('../../lib/http/response');

const index = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const payables = await service.getAllPayables(page, limit);
    return buildSuccessResponse(res, 200, payables);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  index,
};
