const payableService = require('../../../services/payable');
const logger = require('../../../lib/logger')('PAYABLES_WORKERS');

function createPayable(queueConfig) {
  return async (message) => {
    const payload = JSON.parse(message.Body);

    const {
      amount,
      customer_id: customerId,
      fee,
      payment_date: paymentDate,
      payment_method: paymentMethod,
      status,
      transaction_id: transactionid,
    } = payload;

    await payableService.createPayable({
      amount,
      customerId,
      fee,
      paymentDate,
      paymentMethod,
      status,
      transactionid,
    });
  };
}

module.exports = {
  createPayable,
};
