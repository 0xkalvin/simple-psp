const { postgres } = require('../data-sources');
const logger = require('../lib/logger')('TRANSACTION_REPOSITORY');

async function createTransaction(payload) {
  const databaseTransaction = await postgres.pool.transaction();

  try {
    const {
      amount,
      description,
      cardExpirationDate,
      cardHolderName,
      cardLastFourNumbers,
      cardVerificationCode,
      paymentMethod,
    } = payload;

    const createdTransaction = await postgres.pool.models.Transaction.create(
      {
        amount,
        description,
        card_expiration_date: cardExpirationDate,
        card_holder_name: cardHolderName,
        card_last_four_numbers: cardLastFourNumbers,
        card_verification_code: cardVerificationCode,
        payment_method: paymentMethod,
      },
      { transaction: databaseTransaction },
    );

    await databaseTransaction.commit();

    return {
      id: createdTransaction.id,
      amount,
      description,
      cardExpirationDate,
      cardHolderName,
      cardLastFourNumbers,
      cardVerificationCode,
      paymentMethod,
      createdAt: createdTransaction.created_at,
    };
  } catch (error) {
    await databaseTransaction.rollback();

    logger.error({
      message: 'Failed to insert transaction on postgres',
      error_message: error.message,
      error_stack: error.stack,
    });

    throw error;
  }
}

async function getTransactions(filters) {
  const { limit, offset } = filters;

  const transactions = await postgres.pool.models.Transaction.findAll({
    offset,
    limit,
    order: [
      ['created_at', 'DESC'],
    ],
  });

  return transactions;
}

async function getTransactionById(transactionId) {
  const transaction = await postgres.pool.models.Transaction.findOne({
    where: {
      id: transactionId,
    },
  });

  return transaction;
}

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactions,
};
