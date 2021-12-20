const transactionService = require('../../../services/transaction');

function settleTransactions() {
  return async (message) => {
    const transactionsIds = JSON.parse(message.Body);

    await transactionService.settleTransactions(transactionsIds);
  };
}

module.exports = {
  settleTransactions,
};
