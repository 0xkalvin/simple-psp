const payableService = require('../../../services/payable');
const logger = require('../../../lib/logger')('PAYABLES_WORKERS');

function createPayable(queueConfig) {
  return async (message) => {
    const payload = JSON.parse(message.Body);

    const {
      fee,
      status,
      transaction_id: transactionid,
      amount,
      payment_date: paymentDate,
      payment_method: paymentMethod,
    } = payload;

    await payableService.createPayable({
      fee,
      status,
      transactionid,
      amount,
      paymentDate,
      paymentMethod,
    });
  };
}

module.exports = {
  createPayable,
};
