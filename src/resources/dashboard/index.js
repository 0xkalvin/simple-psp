const service = require('./service');
const {buildSuccessResponse} = require('../../lib/http/response');


const index = async (req, res, next) => {
  try {
    const response = await service.buildDashboard();
    return buildSuccessResponse(res, 200, response);
  } catch (err) {
    return next(err);
  }
};


module.exports = {
  index,
};
