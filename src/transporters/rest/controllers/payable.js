const payableService = require('../../../services/payable');

async function list(request, response, next) {
  try {
    const { page, limit } = request.query;
    const payables = await payableService.getPayables({
      page,
      limit,
    });

    return response.status(200).json(payables);
  } catch (error) {
    return next(error);
  }
}

async function show(request, response, next) {
  try {
    const { id } = request.params;
    const payable = await payableService.getOnePayable(id);

    return response.status(200).json(payable);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  show,
};
