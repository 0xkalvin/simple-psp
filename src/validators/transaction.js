const Joi = require('joi');

const createTransactionSchema = Joi.object({
  description: Joi
    .string()
    .allow('')
    .required(),

  amount: Joi
    .number()
    .integer()
    .positive()
    .required(),

  paymentMethod: Joi
    .valid('credit_card', 'debit_card')
    .required(),

  cardNumber: Joi
    .string()
    .creditCard()
    .required(),

  cardHolderName: Joi
    .string()
    .required(),

  cardExpirationDate: Joi
    .string()
    .required(),

  cardVerificationCode: Joi
    .string()
    .length(3)
    .required(),

  customerId: Joi
    .string()
    .required(),
});

const listTransactionSchema = Joi.object({
  customerId: Joi
    .string()
    .required(),
});

function buildErrorList(joiError) {
  return joiError.details.map((detail) => ({
    message: detail.message,
    path: detail.path.join('.'),
  }));
}

function validateTransactionCreationPayload(payload) {
  try {
    const result = createTransactionSchema.validate(payload, {
      abortEarly: false,
    });

    const error = result.error ? buildErrorList(result.error) : null;

    return {
      error,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

function validateTransactionListPayload(payload) {
  try {
    const result = listTransactionSchema.validate(payload, {
      abortEarly: false,
    });

    const error = result.error ? buildErrorList(result.error) : null;

    return {
      error,
    };
  } catch (error) {
    return {
      error,
    };
  }
}

module.exports = {
  createTransactionSchema,
  listTransactionSchema,
  validateTransactionCreationPayload,
  validateTransactionListPayload,
};
