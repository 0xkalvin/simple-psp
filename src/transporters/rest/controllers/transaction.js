const transactionService = require('../../../services/transaction');

async function create(request, response, next) {
  try {
    const {
      amount,
      description,
      card_expiration_date: cardExpirationDate,
      card_holder_name: cardHolderName,
      card_number: cardNumber,
      card_verification_code: cardVerificationCode,
      payment_method: paymentMethod,
    } = request.body;

    const transaction = await transactionService.createTransaction({
      amount,
      description,
      cardExpirationDate,
      cardHolderName,
      cardNumber,
      cardVerificationCode,
      paymentMethod,
    });

    return response.status(201).json(transaction);
  } catch (error) {
    return next(error);
  }
}

async function list(request, response, next) {
  try {
    const { page, limit } = request.query;

    const transactions = await transactionService.getTransactions({
      page,
      limit,
    });

    return response.status(200).json(transactions);
  } catch (error) {
    return next(error);
  }
}

async function show(request, response, next) {
  try {
    const { id } = request.params;
    const transaction = await transactionService.getOneTransaction(id);

    return response.status(200).json(transaction);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  show,
};
