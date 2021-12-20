const payableService = require('../../../services/payable');

function createPayable() {
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

function settlePayables() {
  return async (message) => {
    const payablesIds = JSON.parse(message.Body);

    await payableService.settlePayables(payablesIds);
  };
}

module.exports = {
  createPayable,
  settlePayables,
};
